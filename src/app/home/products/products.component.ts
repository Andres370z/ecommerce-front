import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/shared/services/cart.service';
import { ProductsService } from 'src/app/shared/services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: any[]=[];
  constructor(
    private productService: ProductsService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe((res: any)=>{
      this.products = res.products;
      console.log('esta es tu respuesta ----> ', res);
      
    })
  }
  addtoCart(id: number){
    this.cartService.addProdutCarr(id)
  }

}
