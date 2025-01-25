import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/shared/services/cart.service';
import { ProductsService } from 'src/app/shared/services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  currentPage: number = 1;
  totalPages: number;
  constructor(
    private productService: ProductsService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.getProducts();
  }
  getProducts() {
    this.productService.getAllProducts(this.currentPage, 9).subscribe((res: any) => {
      this.products = res.products;
      this.totalPages = res.count;
      console.log('esta es tu respuesta ----> ', res);

    })
  }
  addtoCart(id: number){
    this.cartService.addProdutCarr(id)
  }
  onPageChange(page: number): void {
    this.currentPage = page;
    this.getProducts();
  }

}
