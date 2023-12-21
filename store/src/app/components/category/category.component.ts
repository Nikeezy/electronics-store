import { Component, Input } from '@angular/core';
import { Category } from 'src/app/models/category/category.model';
import { TranslateService } from 'src/app/services/translate/translate.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent {

  constructor(private translateService: TranslateService) { }

  @Input() category?: Category;

  getRussianCategoryName(key: string) {
    return this.translateService.getCategoryTranslation(key);
  }
}