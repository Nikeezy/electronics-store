import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs';

const DB_BASE_URL = 'http://localhost:8080/api'

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  constructor(private http: HttpClient) {}

  private currentFilterParams: any = {};

  @Output() filterUpdated = new EventEmitter<any>();
  
  setFilter(params: any) {
    this.currentFilterParams = JSON.parse(JSON.stringify(params));
    this.filterUpdated.emit(this.currentFilterParams);
  }

  getFilter(): any {
    console.log('Беру текущие параметры: ', {...this.currentFilterParams});
    return { ...this.currentFilterParams };
  }

  // Get filter by category
  getFilterByCategory(category?: string): Observable<any> {
    return this.http.get(`${DB_BASE_URL}/filter/${category}`);
  }
}

