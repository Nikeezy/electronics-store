import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { delay } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';
import { PopUpComponent } from 'src/app/components/pop-up/pop-up.component';
import { Product } from 'src/app/models/product/product.model';
import { CartService } from 'src/app/services/cart/cart.service';
import { CookiesService } from 'src/app/services/cookies/cookies.service';
import { SharedService } from 'src/app/services/shared/shared.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  products?: Array<Product>;
  cartSubscription?: Subscription;
  isLoading: boolean = false;

  constructor(private cartService: CartService,
    private cookiesService: CookiesService,
    private sharedService: SharedService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getProductsFromCart();

    this.sharedService.updateCart$.subscribe(() => {
      this.getProductsFromCart();
    });
  }

  getProductsFromCart(): void {
    this.isLoading = true;
    this.products = [];

    this.cartSubscription = this.cartService
      .getProductsFromCart(this.cookiesService.getUsernameCookie())
      .pipe(
        delay(1000)
      )
      .subscribe(products => {
        this.products = products;
        this.isLoading = false;
      });
  }

  getTotalCount(): number {
    return this.products ? this.products.reduce((total, product) => total + product.count, 0) : 0;
  }

  getTotalAmount(): number {
    return this.products ? this.products.reduce((total, product) => total + (product.product_price * product.count), 0) : 0;
  }

  getItemsWord(count: number): string {
    if (count % 10 === 1 && count % 100 !== 11) {
      return 'товар';
    } else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
      return 'товара';
    } else {
      return 'товаров';
    }
  }

  makePurchase(): void {
    const dialogRef = this.dialog.open(PopUpComponent, {
      width: '300px',
      data: {
        title: 'Оформление заказа',
        message: 'Вы уверены, что готовы оформить заказ?',
        confirmLabel: 'Оформить',
        cancelLabel: 'Отмена',
        actionType: 'purchase',
      },
    });

    const username = this.cookiesService.getUsernameCookie();

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'purchased') {
        this.cartService.makePurchase(username).subscribe({
          next: () => {
            this.sharedService.triggerCartUpdate();
          },
          error: (error) => {
            console.error('Error removing product:', error);
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
}