import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpsService } from './https.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductModelServer, registerCategory, registerProduct } from 'src/app/models/product.model';
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
  async getAllproductss(page: number = 1,results: number = 10): Promise<any>{
    try {
      const response: any = await this.httpClient.get<ServerResponse>(`${this.URL_SERVE}products`, {
        params: {
          page: page.toString(),
          limit: results.toString() 
        }
      }).toPromise();
      return response
    }catch (error){
      console.log('error --->', error);
      this.notificationService.errorNotifi('Ups', 'Error en el servicio');
      
    }
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
    return this.httpService.POST(`products/create`, product)
  }
  
  createoneCategory(category: registerCategory){
    return this.httpService.POST(`categories/create`, category);
  }
}
