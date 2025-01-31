import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { title } from 'process';
import { registerCategory } from 'src/app/models/product.model';
import { NotificationsService } from 'src/app/shared/services/notifications.service';
import { OrderService } from 'src/app/shared/services/order.service';
import { ProductsService } from 'src/app/shared/services/products.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  products: any[] = [];
  currentPage: number = 1;
  totalPages: number;
  public forms: FormGroup
  constructor(
    private productsService: ProductsService,
    private alertService: NotificationsService,
    private formBuilder: FormBuilder
  ) { } 

  ngOnInit(): void {
    this.getProducts();
    this.forms = this.formBuilder.group({
      title: ['', Validators.compose([Validators.required])],
    })
  }
  getProducts() {
    this.productsService.getAllProducts(this.currentPage, 10).subscribe((res: any) => {
      this.products = res.products;
      this.totalPages = Math.ceil(res.totalCount / 10);
      console.log('esta es tu respuesta ----> ', res);

    })
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.getProducts();
  }

  creatCategory(form: any){
    const data = {title: form.title}
    this.productsService.createoneCategory(data).then((res: any)=>{
      this.alertService.succesNotifi('Categoria creada')
      this.forms.reset()
    }).catch((err) => {
      this.alertService.errorNotifi('Ups','Error en el servidor')
      console.log(err);
    });
  }

}
