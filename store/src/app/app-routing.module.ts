import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ShopComponent } from './pages/shop/shop.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './guards/auth/auth.guard';
import { CartComponent } from './pages/cart/cart.component';
import { ProductComponent } from './components/product/product.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [{
  path: 'login',
  component: LoginComponent
},
{
  path: 'register',
  component: RegisterComponent
},
{
  path: 'home',
  component: HomeComponent
},
{
  path: 'shop/:category',
  component: ShopComponent
},
{
  path: 'shop/:category/about/:product_id',
  component: ProductComponent
},
{
  path: 'cart',
  canActivate: [authGuard],
  component: CartComponent
},
{
  path: 'not-found',
  component: NotFoundComponent
},
{
  path: '**', redirectTo: 'not-found', pathMatch: 'full'
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
