import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare var $: any; // Declaramos jQuery globalmente
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(
    private router: Router
  ) { }


  ngOnInit(): void {
  }
  navigate(ruta: string){
    this.router.navigate([ruta]);
  }
}
