import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product/product.model';
import { CartService } from 'src/app/services/cart/cart.service';
import { CookiesService } from 'src/app/services/cookies/cookies.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { TranslateService } from 'src/app/services/translate/translate.service';
import { PopUpComponent } from '../pop-up/pop-up.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Subscription } from 'rxjs';
import { ShopService } from 'src/app/services/shop/shop.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  @Input() product?: Product;
  @Input() category?: string;

  isAboutPage: boolean = false;
  isCartPage: boolean = false;
  isInCart: boolean = false;
  productSubscription?: Subscription;

  constructor(private dialog: MatDialog,
    private router: Router,
    private cartService: CartService,
    private cookiesService: CookiesService,
    private sharedService: SharedService,
    private translateService: TranslateService,
    private authService: AuthService,
    private shopService: ShopService,
    private route: ActivatedRoute,
  ) {
    this.isCartPage = this.router.url.includes('cart');
    this.isAboutPage = this.router.url.includes('about');
    if (this.isAboutPage) {
      this.route.params.subscribe(params => {
        this.category = params['category'];
        this.getProductById(params['product_id'], this.category);
        this.ngOnInit();
      });
    }
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      if (!this.isCartPage) {
        this.checkProductInCart();
      } else {
        if (this.product) {
          this.category = this.product.category_name;
          if (this.product.stock < 1) {
            this.removeProductFromCart();
          } else if (this.product?.count > this.product?.stock) {
            this.product.count = this.product.stock;
            const username = this.cookiesService.getUsernameCookie();
            this.cartService.updateProductInCart(username, this.product?.product_id, this.product?.count);
          }
        }
      }
    }
  }

  getProductById(product_id?: number, category?: string): void {
    this.productSubscription = this.shopService
      .getProductById(product_id, category)
      .subscribe(product => {
        this.product = product;
        console.log(this.product);
      });
  }

  addProductToCart(): void {
    const username = this.cookiesService.getUsernameCookie();

    if (this.authService.isLoggedIn()) {
      this.cartService.addProductToCart(username, this.product?.product_id)
        .subscribe({
          next: () => {
            this.isInCart = true;
          },
          error: (error) => {
            console.error('Error adding product to cart:', error);
          }
        });
    } else {
      const dialogRef = this.dialog.open(PopUpComponent, {
        width: '300px',
        data: {
          title: 'Необходима авторизация',
          message: 'Чтобы добавить товар в корзину, необходимо авторизоваться. Желаете пройти авторизацию?',
          confirmLabel: 'Войти',
          cancelLabel: 'Отмена',
          actionType: 'login',
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'login') {
          this.router.navigate(['/login']);
        }
      });
    }
  }

  increaseCount(): void {
    const username = this.cookiesService.getUsernameCookie();

    if (this.product) {
      ++this.product.count;
      this.cartService.updateProductInCart(username, this.product?.product_id, this.product.count).subscribe({
        next: () => {

        },
        error: (error) => {
          console.error('Error removing product:', error);
        }
      });
    }
  }

  reduceCount(): void {
    const username = this.cookiesService.getUsernameCookie();

    if (this.product) {
      --this.product.count;
      this.cartService.updateProductInCart(username, this.product?.product_id, this.product.count).subscribe({
        next: () => {

        },
        error: (error) => {
          console.error('Error removing product:', error);
        }
      });
    }
  }

  removeProductFromCart(): void {
    const dialogRef = this.dialog.open(PopUpComponent, {
      width: '300px',
      data: {
        title: 'Удаление товара',
        message: 'Вы уверены, что хотите удалить этот товар из корзины?',
        confirmLabel: 'Удалить',
        cancelLabel: 'Оставить',
        actionType: 'delete',
      },
    });

    const username = this.cookiesService.getUsernameCookie();
    const prodId = this.product?.product_id;

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'deleted') {
        this.cartService.removeProductFromCart(username, prodId).subscribe({
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

  navigateToCart(): void {
    this.router.navigate(['/cart']);
  }

  getRussianCategoryName(key?: string) {
    return this.translateService.getCategoryTranslation(key);
  }

  checkProductInCart(): void {
    const username = this.cookiesService.getUsernameCookie();
    const prodId = this.product?.product_id;

    this.cartService.checkProductInCart(username, prodId)
      .subscribe({
        next: (response) => {
          this.isInCart = response;
        },
        error: (error) => {
          console.error('Error checking product in cart:', error);
        }
      });
  }

  ngOnDestroy(): void {
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
  }
}