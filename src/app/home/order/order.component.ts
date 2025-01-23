import { Component, OnInit } from '@angular/core';
import { cartModelServer } from 'src/app/models/cart.model';
import { CartService } from 'src/app/shared/services/cart.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  cartDta: cartModelServer;
  cartTotal: number;
  subTotal: number;
  constructor(
    public cartService: CartService
  ) { }

  ngOnInit(): void {
    this.cartService.cartData$.subscribe((data: cartModelServer)=> this.cartDta = data);
    this.cartService.cartTotal$.subscribe(tota => this.cartTotal = tota)
  }
  changeQuantity(index: number, increase: boolean){
    this.cartService.updateCartItems(index,increase);
  }

}
