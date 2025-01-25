import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductsService } from './products.service';
import { environment } from 'src/environments/environment';
import { OrderService } from './order.service';
import { cartModelPublic, cartModelServer } from 'src/app/models/cart.model';
import { BehaviorSubject, switchMap } from 'rxjs';
import { ProductModelServer } from 'src/app/models/product.model';
import { NavigationExtras, Router } from '@angular/router';
import { NotificationsService } from './notifications.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private urlserver = environment.URL_SERVE;
  private cartDataClient: cartModelPublic = {
    total: 0,
    productDta: [{
      incart: 0,
      id: 0
    }]
  };
  private cartDateServe: cartModelServer = {
    total: 0,
    data: [{
      numIncart: 0,
      products: undefined
    }]
  };

  cartTotal$ = new BehaviorSubject<number>(0);
  cartData$ = new BehaviorSubject<cartModelServer>(this.cartDateServe);
  constructor(
    private http: HttpClient,
    private productService: ProductsService,
    private orderService: OrderService,
    private router: Router,
    private notificationService: NotificationsService,
    private spinner: NgxSpinnerService
  ) {
    this.cartTotal$.next(this.cartDateServe.total);
    this.cartData$.next(this.cartDateServe);
    let info: cartModelPublic = JSON.parse(localStorage.getItem('cart'));

    if (info !== undefined && info !== null && info.productDta[0].incart !== 0) {
      this.cartDataClient = info;

      this.cartDataClient.productDta.forEach(p => {
        this.productService.getSingleProduct(p.id).subscribe((actualProductInfo: ProductModelServer) => {
          if (this.cartDateServe.data[0].numIncart === 0) {
            this.cartDateServe.data[0].numIncart = p.incart;
            this.cartDateServe.data[0].products = actualProductInfo;
            this.calculateTotal()
            this.cartDataClient.total = this.cartDateServe.total;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient))
          } else {
            this.cartDateServe.data.push({
              numIncart: p.incart,
              products: actualProductInfo
            })
            this.calculateTotal()
            this.cartDataClient.total = this.cartDateServe.total;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient))
          }
          this.cartData$.next({ ... this.cartDateServe })
        })
      })
    } else {
      console.log('se jodio');

    }
  }

  //Agreagar un producto al carrito

  addProdutCarr(id: number, quantity?: number) {

    //Consulta la informacion del producto desde el servicio 
    this.productService.getSingleProduct(id).subscribe(prod => {

      // 1. si el carrito esta vacio
      if (this.cartDateServe.data[0].products === undefined) {
        // Asignamos el producto obtenido al carrito del servidor
        this.cartDateServe.data[0].products = prod;

        // Asignamos la cantidad al producto (si se pasa como parámetro, usamos esa cantidad; de lo contrario, se asigna 1)
        this.cartDateServe.data[0].numIncart = quantity !== undefined ? quantity : 1;
        this.calculateTotal();

        //Calcular el total del carrito basado en el precio y la cantidad de productos
        this.cartDataClient.productDta[0].incart = this.cartDateServe.data[0].numIncart;

        // Sincronizamos el carrito local (cartDataClient) con los datos del servidor
        this.cartDataClient.productDta[0].id = prod.id;
        this.cartDataClient.total = this.cartDateServe.total;
        // Guardamos los datos actualizados en el localStorage
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartData$.next({ ...this.cartDateServe });
        this.notificationService.succesNotifi(`${prod.name} añadido al carrito`);
      } else {
        // Buscamos el índice del producto en el carrito del servidor (cartDateServe)
        let index = this.cartDateServe.data.findIndex(p => p.products.id === prod.id);

        // Si el producto ya está en el carrito (index es un valor positivo)
        if (index !== -1) {
          // Verificamos si se proporciona una cantidad y si es válida (no supera la cantidad disponible del producto)
          if (quantity !== undefined && quantity <= prod.quantity) {
            // Actualizamos la cantidad del producto en el carrito
            // Si la cantidad actual es menor que el stock disponible, usamos la cantidad proporcionada; de lo contrario, usamos el máximo permitido (stock del producto
            this.cartDateServe.data[index].numIncart = this.cartDateServe.data[index].numIncart < prod.quantity ? quantity : prod.quantity;
          } else {
            this.cartDateServe.data[index].numIncart < prod.quantity ? this.cartDateServe.data[index].numIncart++ : prod.quantity
          }
          this.cartDataClient.productDta[index].incart = this.cartDateServe.data[index].numIncart;
          this.notificationService.succesNotifi(`${prod.name} cantidad actualizada en el carrito`);
          this.calculateTotal();
        } else {
          this.cartDateServe.data.push({
            numIncart: 1,
            products: prod
          });
          this.cartDataClient.productDta.push({
            incart: 1,
            id: prod.id
          })

          this.calculateTotal();
          this.cartDataClient.total = this.cartDateServe.total;
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          this.notificationService.succesNotifi(`${prod.name} añadido al carrito`);
          this.cartData$.next({...this.cartDateServe });

        }
      }
    })



    //si el carrito tiene productos
    //a. si los items estan listo en el carrito
    //b. si los items no estan el carrito




  }


  //Actualizar articulos

  updateCartItems(index: number, increase: boolean) {
    let data = this.cartDateServe.data[index];
    if (increase) {
      data.numIncart < data.products.quantity ? data.numIncart++ : data.products.quantity;
      this.cartDataClient.productDta[index].incart = data.numIncart;
      this.calculateTotal();
      this.cartDataClient.total = this.cartDateServe.total;
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      this.cartData$.next({ ...this.cartDateServe });
    } else {
      data.numIncart--;
    }
    if (data.numIncart < 1) {
      this.cartData$.next({ ...this.cartDateServe });
    } else {
      this.cartData$.next({ ...this.cartDateServe });
      this.cartDataClient.productDta[index].incart = data.numIncart;
      this.calculateTotal();
      this.cartDataClient.total = this.cartDateServe.total;
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient))
    }

  }

  //Borrar del carrito
 
  deleteProductFromCart(index: number) {
    if (window.confirm('Enserio quieres quitar este producto?')) {
      this.cartDateServe.data.splice(index, 1);
      this.cartDataClient.productDta.splice(index, 1);
      this.calculateTotal();
      this.cartDataClient.total = this.cartDateServe.total;
      if (this.cartDataClient.total === 0) {
        this.cartDataClient = {productDta: [{incart: 0, id: 0}], total: 0}
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      } else {
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }

      if (this.cartDateServe.total === 0) {
        this.cartDateServe = { total: 0, data: [{ numIncart: 0, products: undefined }] };
        this.cartData$.next({ ...this.cartDateServe });

      } else {
        this.cartData$.next({ ...this.cartDateServe });

      }
    } else {
      return
    }
  }

  calculateTotal() {
    let total = 0;
    this.cartDateServe.data.forEach(p => {
      const { numIncart } = p;
      const { price } = p.products;

      total += numIncart * price;
    })
    this.cartDateServe.total = total;
    this.cartTotal$.next(this.cartDateServe.total)
  }
  calculateSubTotal(index: number){
    let subTotal = 0;
    let p= this.cartDateServe.data[index];
    subTotal = p.products.price * p.numIncart;
    return subTotal
  }

  
  checkoutFromCart(userId: Number, datUsr: any) {
    this.http.post(`${this.urlserver}orders/payment`, null).pipe(
      switchMap((res: { success: Boolean }) => {
        if (res.success) {
          this.resetServerData();
          return this.http.post(`${this.urlserver}orders/new`, {
            userId: userId,
            products: this.cartDataClient.productDta,
            email: datUsr.email,
            address: datUsr.address,
            nameClient: datUsr.nameClient,
            phoneClient: datUsr.phoneClient,
          });
        } else {
          this.spinner.hide();
          this.notificationService.errorNotifi('Ups','No pudimos reservar el producto');
          throw new Error('No se pudo procesar el pago');
        }
      }),
      switchMap((data: OrderResponse) => {
        return this.orderService.getSingleOrder(data.order_id).then(prods => ({
          data, prods,
        }));
      })
    ).subscribe(({ data, prods }) => {
      if (data.success) {
        console.log('------> products', prods);
        
        const navigationExtras: NavigationExtras = {
          state: {
            message: data.message,
            products: prods,
            orderId: data.order_id,
            total: this.cartDataClient.total,
          },
        };
        this.spinner.hide();
        this.router.navigate(['/thanks'], navigationExtras).then(() => {
          this.cartDataClient = { productDta: [{ incart: 0, id: 0 }], total: 0 };
          this.cartTotal$.next(0);
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        });
      } else {
        console.log('se jodió aquí');
      }
    }, error => {
      console.error('Error en el proceso de checkout:', error);
    });
  }


  private resetServerData() {
    this.cartDateServe = {
      total: 0,
      data: [{
        numIncart: 0,
        products: undefined
      }]
    };
    this.cartData$.next({ ...this.cartDateServe });
  }
}

interface OrderResponse {
  order_id: number;
  success: boolean;
  message: string,
  products: [{
    id: string,
    numIncart: string
  }];
}
