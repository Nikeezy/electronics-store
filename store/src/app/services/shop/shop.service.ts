import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../models/product/product.model';

const DB_BASE_URL = 'http://localhost:8080/api'

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  constructor(private httpClient: HttpClient) { }

  getProductsByFilter(filterParams: any): Observable<any> {
    const params = new HttpParams({
      fromObject: filterParams
    });

    return this.httpClient.get<Array<Product>>(
      `${DB_BASE_URL}/products/filter`,
      { params }
    );
  }

  getProductById(productId?: number, category?: string): Observable<Product> {
    return this.httpClient.get<Product>(`${DB_BASE_URL}/products/${category}/${productId}`);
  }
}
