import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  
  constructor(private router: Router) { }

  errorNotifi(title: string, info: string) {
    Swal.fire({
      icon: "error",
      title: title,
      text: info,
    });
  }
  succesNotifi(info: string){
    Swal.fire({
      title: "En hora buena",
      text: info,
      icon: "success"
    });
  }
  successfulRedirects(title: string,info: string, ruta: string){
    Swal.fire({
      icon: 'success',
      title: title,
      text: info,
      // showDenyButton: true,
      confirmButtonText: "Ok",
      allowOutsideClick: false
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.router.navigate([ruta])
      }
    });
  }
  successErrorRedirects(title: string,info: string, ruta: string){
    Swal.fire({
      icon: 'error',
      title: title,
      text: info,
      showDenyButton: true,
      confirmButtonText: "Ok",
      allowOutsideClick: false
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.router.navigate([ruta])
      }
    });
  }
}
