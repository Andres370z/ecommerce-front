import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { cartModelServer } from 'src/app/models/cart.model';
import { CartService } from 'src/app/shared/services/cart.service';
import { NotificationsService } from 'src/app/shared/services/notifications.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  cartDta: cartModelServer;
  cartTotal: number;
  subTotal: number;
  forms: FormGroup
  constructor(
    public cartService: CartService,
    private formBuilder: FormBuilder,
    private alertService: NotificationsService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.cartService.cartData$.subscribe((data: cartModelServer) => this.cartDta = data);
    this.cartService.cartTotal$.subscribe(tota => this.cartTotal = tota);
    this.forms = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      email: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.email])],
      address: ['', Validators.compose([Validators.required])],
      phone: ['', Validators.compose([Validators.required, Validators.minLength(9)])],
    })
  }
  changeQuantity(index: number, increase: boolean) {
    this.cartService.updateCartItems(index, increase);
  }

  onSubmin(form: any) {
    if (this.forms.valid) {
      this.spinner.show().then(p =>{
        const dtaU = {
          email: form.email,
          address: form.address,
          nameClient: form.name,
          phoneClient: String(form.phone)
        } 
        this.cartService.checkoutFromCart(2, dtaU)
      });

      console.log('----> ', form)
    } else {
      this.alertService.errorNotifi('Error', 'Todos los campos son obligatorios')
    }
  }


}
