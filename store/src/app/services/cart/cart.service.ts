import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../../models/product/product.model';
import { Observable } from 'rxjs';

const DB_BASE_URL = 'http://localhost:8080/cart'

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private httpClient: HttpClient) { }

  addProductToCart(username?: string, productId?: number): Observable<any> {
    return this.httpClient.post(`${DB_BASE_URL}/add`, { username, productId });
  }

  getProductsFromCart(username?: string): Observable<Array<Product>> {
    let params = new HttpParams();
    if (username) {
      params = params.set('username', username);
    }

    return this.httpClient.get<Array<Product>>(`${DB_BASE_URL}/products`, { params });
  }

  removeProductFromCart(username?: string, productId?: number): Observable<any> {
    let params = new HttpParams();
    if (username && productId) {
      params = params.set('username', username).set('productId', productId);
    }

    return this.httpClient.get(`${DB_BASE_URL}/remove`, { params });
  }

  updateProductInCart(username?: string, productId?: number, newCount?: number): Observable<any> {
    return this.httpClient.post(`${DB_BASE_URL}/update`, { username, productId, newCount });
  }

  checkProductInCart(username?: string, productId?: number): Observable<any> {
    let params = new HttpParams();
    if (username && productId) {
      params = params.set('username', username).set('productId', productId);
    }

    return this.httpClient.get<boolean>(`${DB_BASE_URL}/check`, { params });
  }

  makePurchase(username: string): Observable<any> {
    return this.httpClient.post(`${DB_BASE_URL}/purchase`, { username });
  }
}
