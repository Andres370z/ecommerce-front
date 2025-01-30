import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

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
    private httpClient: HttpClient
  ) { }

  //login con usuario y contraseña

  loginUser(email: string, pass: string){
    this.httpClient.post(`${this.SERVER_URL}auth/login`, {email, pass}).subscribe((data: ResponseModel)=>{
      this.auth = data.auth;
      this.authState$.next(this.auth);
      this.userData$.next(data);
    });
  }

  logout(){
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
