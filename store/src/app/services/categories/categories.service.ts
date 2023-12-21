import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Category } from '../../models/category/category.model';

const DB_BASE_URL = 'http://localhost:8080/api'

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private httpClient: HttpClient) { }

  getAllCategories(): Observable<Array<Category>> {
    return this.httpClient.get<Array<Category>>(
      `${DB_BASE_URL}/categories`
    )
  }
}
