import { Injectable } from '@angular/core';
import { ProductsService } from './products.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ProductModelServer } from 'src/app/models/product.model';

@Injectable({
  providedIn: 'root'
})


export class OrderService {
  private urlserve = environment.URL_SERVE
  
  constructor(
    private httpClient: HttpClient,
    private productService: ProductsService
  ) { }
  getSingleOrder(ordenId: number){
    return this.httpClient.get<productResponseModel[]>(`${this.urlserve}orderId`).toPromise();
  }

}
interface productResponseModel {
  id: number,
  title: string,
  description: string,
  price: number,
  quantityOrdered: number,
  image: string
}