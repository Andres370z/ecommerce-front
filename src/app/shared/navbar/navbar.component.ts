import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { cartModelServer } from 'src/app/models/cart.model';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';

declare var $: any; // Declaramos jQuery globalmente
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  cartDta: cartModelServer;
  cartTotal: number;
  authState: boolean;
  activeLink: string = ''; 
  constructor(
    private router: Router,
    public cartService: CartService,
    private authService: AuthService
  ) { }


  ngOnInit(): void {
    this.cartService.cartTotal$.subscribe(total => {this.cartTotal = total});
    this.cartService.cartData$.subscribe(data => this.cartDta = data)
    this.authService.authState$.subscribe(authState => this.authState = authState)
  }
  navigate(ruta: string){
    this.router.navigate([ruta]);
  }
  setActive(link: string) {
    this.activeLink = link;
  }


}
