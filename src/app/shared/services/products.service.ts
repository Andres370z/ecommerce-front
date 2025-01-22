import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpsService } from './https.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductModelServer, registerProduct } from 'src/app/models/product.model';
import { ServerResponse } from 'http';
import { NotificationsService } from './notifications.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private URL_SERVE = environment.URL_SERVE
  private imgUrl = environment.URL_IMAGEUP

  constructor(
    private httpService: HttpsService,
    private httpClient: HttpClient,
    private notificationService: NotificationsService
  ) { }

  getAllProducts(page: number = 1,results: number = 10): Observable<ServerResponse>{
    return this.httpClient.get<ServerResponse>(`${this.URL_SERVE}products`, {
      params: {
        page: page.toString(),
        limit: results.toString()
      }
    })
  }

  getSingleProduct(id: number): Observable<ProductModelServer>{
    return this.httpClient.get<ProductModelServer>(`${this.URL_SERVE}products/${id}`);
  }

  getProdutcsCategory(productName: string){
    return this.httpClient.get<ProductModelServer>(`${this.URL_SERVE}products/categoty/${productName}`);

  }
  uploadImages(file: any): Observable<any> {
    try {
      return this.httpClient.post(this.imgUrl, file);
    } catch (error) {
      console.log('Se jodio esta vaina', error);
    }
  }

  registerNewProducts(product: registerProduct){
    return this.httpClient.post<registerProduct>(`${this.URL_SERVE}products/create`, product)
  }
  
}
