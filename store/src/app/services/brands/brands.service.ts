import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Brand } from '../../models/brand/brand.model';

const DB_BASE_URL = 'http://localhost:8080/api'

@Injectable({
  providedIn: 'root'
})
export class BrandsService {
  
  constructor(private httpClient: HttpClient) { }

  getAllBrands(): Observable<Array<Brand>> {
    return this.httpClient.get<Array<Brand>>(
      `${DB_BASE_URL}/brands`
    )
  }
}
