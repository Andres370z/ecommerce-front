import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';

const routes: Routes = [{path: '', component: HomeComponent},
  {path: 'products', loadChildren: () => import('./products/products.module').then(m => m.ProductsModule)},
  {path: 'about', loadChildren: () => import('./about/about.module').then(m => m.AboutModule)},
  {path: 'contact', loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule)},
  {path: 'new-products', loadChildren: () => import('./new-product/new-product.module').then(m => m.NewProductModule)},
  {path: 'product-list', loadChildren: () => import('./product-list/product-list.module').then(m => m.ProductListModule)},
  {path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)},
  {path: 'order-details', loadChildren: () => import('./order/order.module').then(m => m.OrderModule)},
  {path: 'thanks', loadChildren: () => import('./thanks/thanks.module').then(m => m.ThanksModule)},
  {path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule)},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
