import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/models/category/category.model';
import { CategoriesService } from 'src/app/services/categories/categories.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  categories?: Array<Category>;
  categoriesSubscription?: Subscription;
  
  constructor (private categoriesService: CategoriesService) { }

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories() {
    this.categoriesSubscription = this.categoriesService
    .getAllCategories()
    .subscribe(categories => {
      this.categories = categories;
    });
  }

  ngOnDestroy(): void {
    if (this.categoriesSubscription) {
      this.categoriesSubscription.unsubscribe();
    }
  }
}