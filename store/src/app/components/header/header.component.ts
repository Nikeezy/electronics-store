import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/models/category/category.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { CookiesService } from 'src/app/services/cookies/cookies.service';
import { TranslateService } from 'src/app/services/translate/translate.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  isLoggedIn?: boolean;
  categories?: Array<Category>;
  categoriesSubscription?: Subscription;
  username?: string;

  constructor(private authService: AuthService,
    private router: Router,
    private categoriesService: CategoriesService,
    private translateService: TranslateService,
    private cookiesService: CookiesService) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.getAllCategories();
    if (this.isLoggedIn) {
      this.username = this.cookiesService.getUsernameCookie();
    }
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/home']);
        this.ngOnInit();
      },
      error: (error) => {
        console.error('Logout error:', error);
      }
    })
  }

  navigateToShop(categoryName: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/shop', categoryName]);
    });
  }

  getAllCategories() {
    this.categoriesSubscription = this.categoriesService
      .getAllCategories()
      .subscribe(categories => {
        this.categories = categories;
      });
  }

  getRussianCategoryName(key: string) {
    return this.translateService.getCategoryTranslation(key);
  }

  ngOnDestroy(): void {
    if (this.categoriesSubscription) {
      this.categoriesSubscription.unsubscribe();
    }
  }
}