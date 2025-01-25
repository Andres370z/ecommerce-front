import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '../shared/services/products.service';
import { CartService } from '../shared/services/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: any[]=[];
  constructor(
    private router: Router,
    private productService: ProductsService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.productService.getAllProducts(1,6).subscribe((res: any)=>{
      this.products = res.products;
      console.log('esta es tu respuesta ----> ', res);
      
    })
  }
  navigate(ruta: string){
    this.router.navigate([ruta])
  }
  addtoCart(id: number){
    this.cartService.addProdutCarr(id)
  }

}
