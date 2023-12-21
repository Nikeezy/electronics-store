import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Product } from 'src/app/models/product/product.model';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private updateCartSource = new Subject<void>();

  updateCart$ = this.updateCartSource.asObservable();

  triggerCartUpdate() {
    this.updateCartSource.next();
  }
}
