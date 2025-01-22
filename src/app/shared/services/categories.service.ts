import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private URL_SERVE = environment.URL_SERVE
  
  constructor(
    private htpp: HttpClient
  ) { }
 

  getCategories(){
    return this.htpp.get(`${this.URL_SERVE}categories`)
  }
}
