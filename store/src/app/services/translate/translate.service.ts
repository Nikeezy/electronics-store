import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {

  private categoryTranslations: { [key: string]: string } = {
    'smartphones': 'Смартфоны',
    'laptops': 'Ноутбуки',
    'pc': 'ПК',
    'tv': 'ТВ',
    'consoles': 'Консоли',
    '': 'Неизвестная категория',
  };

  getCategoryTranslation(key?: string): string {
    if (key) {
      return this.categoryTranslations[key];
    } else {
      return this.categoryTranslations[''];
    }
  }
}
