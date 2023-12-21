import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { CategoryComponent } from './components/category/category.component';
import { HttpClientModule } from '@angular/common/http';
import { CategoriesService } from './services/categories/categories.service';
import { ShopComponent } from './pages/shop/shop.component';
import { ProductComponent } from './components/product/product.component';
import { FilterComponent } from './components/filter/filter.component';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { CartComponent } from './pages/cart/cart.component';
import { PopUpComponent } from './components/pop-up/pop-up.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NotFoundComponent } from './pages/not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    CategoryComponent,
    ShopComponent,
    ProductComponent,
    FilterComponent,
    RegisterComponent,
    LoginComponent,
    CartComponent,
    PopUpComponent,
    StarRatingComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
    ReactiveFormsModule,
    NgxPaginationModule,
  ],
  providers: [CategoriesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
