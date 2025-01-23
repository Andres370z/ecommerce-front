import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { cartModelServer } from 'src/app/models/cart.model';
import { CartService } from '../services/cart.service';

declare var $: any; // Declaramos jQuery globalmente
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  cartDta: cartModelServer;
  cartTotal: number
  constructor(
    private router: Router,
    public cartService: CartService
  ) { }


  ngOnInit(): void {
    this.cartService.cartTotal$.subscribe(total => {this.cartTotal = total});
    this.cartService.cartData$.subscribe(data => this.cartDta = data)
  }
  navigate(ruta: string){
    this.router.navigate([ruta]);
  }


}
