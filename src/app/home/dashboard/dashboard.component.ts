import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/shared/services/products.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  products: any[] = [];
  currentPage: number = 1;
  totalPages: number;
  constructor(
    private productsService: ProductsService
  ) { }

  ngOnInit(): void {
    this.getProducts();
  }
  getProducts() {
    this.productsService.getAllProducts(this.currentPage, 10).subscribe((res: any) => {
      this.products = res.products;
      this.totalPages = res.count;
      console.log('esta es tu respuesta ----> ', res);

    })
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.getProducts();
  }

}
