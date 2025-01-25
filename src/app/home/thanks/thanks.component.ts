import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-thanks',
  templateUrl: './thanks.component.html',
  styleUrls: ['./thanks.component.scss']
})
export class ThanksComponent implements OnInit {
  message: string;
  orderId: number;
  products;
  cartTotal: number;
  constructor(
    private router: Router,
    private orderService: OrderService
  ) { 
    const navigation = router.getCurrentNavigation();
    const state = navigation.extras.state as {
      message: string,
      products: ProductsResponseModel[],
      orderId: number,
      total: number
    }; 

    this.message = state.message;
    this.products = state.products;
    this.orderId = state.orderId;
    this.cartTotal = state.total;
  }

  ngOnInit(): void {
    console.log(this.products);
    
  }

}

interface ProductsResponseModel {
  id: number,
  title: string,
  price: number,
  quantity: number,
  image: string
}
