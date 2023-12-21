import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Brand } from 'src/app/models/brand/brand.model';
import { BrandsService } from 'src/app/services/brands/brands.service';
import { FilterService } from 'src/app/services/filter/filter.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent {

  filters?: { [key: string]: any[] };
  filterParams: { [key: string]: any[] } = {};
  brandsSubscription?: Subscription;
  category?: string;
  brands?: Array<Brand>;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  productName?: string;
  filterListState: { [key: string]: boolean } = {};
  showFilterNotification = true;

  constructor(private brandsService: BrandsService,
    private filterService: FilterService,
    private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.category = params['category'];
    });
  }

  ngOnInit(): void {
    this.filterService.getFilterByCategory(this.category).subscribe(data => {
      this.filters = data;
      for (let key in data) {
        this.filterParams[key] = [];
      }
    });
    this.getFilterParams();
    this.getAllBrands();
  }

  toggleFilterList(key: string): void {
    this.filterListState[key] = !this.filterListState[key];
  }

  isFilterListOpen(key: string): boolean {
    return this.filterListState[key];
  }

  getFilterParams(): any {
    const params = {
      ...this.filterParams,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      category: this.category,
      rating: this.rating,
      productName: this.productName,
    };

    this.showFilterNotification = false;
    this.filterService.setFilter(params);
  }

  resetFilter(): void {
    for (let key in this.filterParams) {
      this.filterParams[key] = [];
    }

    this.minPrice = undefined;
    this.maxPrice = undefined;
    this.rating = undefined;
    this.productName = undefined;

    const params = {
      ...this.filterParams,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      category: this.category,
      rating: this.rating,
      productName: this.productName,
    };

    this.showFilterNotification = false;
    this.filterService.setFilter(params);
  }

  getAllBrands() {
    this.brandsSubscription = this.brandsService
      .getAllBrands()
      .subscribe(brands => {
        this.brands = brands;
      });
  }

  toggleFilterSelection(filterKey: string, value: any) {
    if (this.filterParams[filterKey].includes(value)) {
      this.filterParams[filterKey] = this.filterParams[filterKey].filter((v: any) => v !== value);
    } else {
      this.filterParams[filterKey].push(value);
    }

    this.showFilterNotification = true;
  }

  ngOnDestroy(): void {
    if (this.brandsSubscription) {
      this.brandsSubscription.unsubscribe();
    }
  }
}