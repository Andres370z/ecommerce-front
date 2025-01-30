import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CartService } from 'src/app/shared/services/cart.service';
import { ProductsService } from 'src/app/shared/services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  currentPage: number = 1;
  totalPages: number;
  constructor(
    private productService: ProductsService,
    private cartService: CartService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.getProducts();
    this.getCategory();
  }
  getProducts() {
    this.productService.getAllProducts(this.currentPage, 9).subscribe((res: any) => {
      this.products = res.products;
      this.totalPages = res.count;

    })
  }
  addtoCart(id: number){
    this.cartService.addProdutCarr(id)
  }
  onPageChange(page: number): void {
    this.currentPage = page;
    this.getProducts();
  }
  getCategory(){
    this.productService.getAllCategories().then((res: any)=>{
      this.categories = res.categories;
    })
  }
  getSigleCategory(name: string){
    this.spinner.show();
    this.productService.getSingleCategory(name).then((res: any)=>{
      this.products = res.products;
      setTimeout(() => {
        this.spinner.hide();
      }, 2000);
    })
  }

}
