import { Component } from '@angular/core';
import { Subscription, delay } from 'rxjs';
import { Product } from 'src/app/models/product/product.model';
import { ShopService } from 'src/app/services/shop/shop.service';
import { FilterService } from 'src/app/services/filter/filter.service';
import { TranslateService } from 'src/app/services/translate/translate.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent {
  products?: Array<Product>;
  productsSubscription?: Subscription;
  brandsSubscription?: Subscription;
  isLoading: boolean = false;
  category?: string;
  currentPage: number = 1;
  totalCount: number = 0;
  itemsPerPage: number = 5;
  displayedFrom: number = 0;
  displayedTo: number = 0;

  constructor(private shopService: ShopService,
    private filterService: FilterService,
    private translateService: TranslateService,
    private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.category = params['category'];
      this.ngOnInit();
    });
  }

  ngOnInit(): void {
    this.filterService.filterUpdated.subscribe((filterParams: any) => {
      this.currentPage = 1;
      filterParams['current_page'] = this.currentPage;
      filterParams['items_per_page'] = this.itemsPerPage;
      this.totalCount = 0;
      this.getProductsByFilter(filterParams);
    });
  }

  getProductsByFilter(params: any) {
    this.isLoading = true;
    this.products = [];

    this.productsSubscription = this.shopService
      .getProductsByFilter(params)
      .pipe(
        delay(1000)
      )
      .subscribe(response => {
        this.products = response.products;
        this.totalCount = response.totalCount > this.totalCount ? response.totalCount : this.totalCount;
        this.isLoading = false;
        if (this.products) {
          this.displayedFrom = (this.currentPage - 1) * this.itemsPerPage + 1;
          this.displayedTo = this.displayedFrom + this.products.length - 1;
        }
      });
  }

  getRussianCategoryName(key: string) {
    return this.translateService.getCategoryTranslation(key);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    const filter = this.filterService.getFilter();
    filter['current_page'] = page;
    this.getProductsByFilter(filter);
  }
  
  ngOnDestroy(): void {
    if (this.productsSubscription) {
      this.productsSubscription.unsubscribe();
    }
    if (this.brandsSubscription) {
      this.brandsSubscription.unsubscribe();
    }
  }
}