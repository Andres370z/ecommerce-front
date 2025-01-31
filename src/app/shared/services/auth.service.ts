import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpsService } from './https.service';
import { NotificationsService } from './notifications.service';
import { error } from 'console';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth: boolean = false;
  private SERVER_URL = environment.URL_SERVE;
  private user;
  authState$ = new BehaviorSubject<boolean>(this.auth);
  userData$ = new BehaviorSubject<ResponseModel>(null);
  constructor(
    private httpClient: HttpClient,
    private httpService: HttpsService,
    private alertService: NotificationsService
  ) {
    if (sessionStorage.getItem('token')) {
      if (sessionStorage.getItem('auth') == 'true') {
        this.auth = true
      }
    }
   }

  //login con usuario y contraseña

  loginUser(email: string, password: string) {
    this.httpClient.post(`${this.SERVER_URL}auth/login`, { email, password }).subscribe((data: ResponseModel) => {
      this.auth = data.auth;
      this.authState$.next(this.auth);
      this.userData$.next(data);
    });
  }
  login(data: any) {
    return this.httpService.POST('auth/login', data).then((data: ResponseModel) => {
      console.log('esta es data ---> ', data);
      sessionStorage.setItem('token', JSON.stringify(data.token));
      sessionStorage.setItem('auth', JSON.stringify(data.auth));

      // localStorage.setItem('token', JSON.stringify(this.cartDataClient))
      this.auth = data.auth;
      this.authState$.next(this.auth);
      this.userData$.next(data);
    }).catch((err)=>{
      return Promise.reject(err); 
      
    })
  }

  logout() {
    this.auth = false;
    this.authState$.next(this.auth);

  }

}

interface ResponseModel {
  token: string,
  auth: boolean,
  email: string,
  username: string,
  fname: string,
  lname: string,
  photoUrl: string,
  userId: number
}
