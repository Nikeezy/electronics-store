import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss']
})
export class StarRatingComponent {
  @Input() rating?: number;

  getStarsArray(): boolean[] {
    const rating = this.rating !== undefined ? this.rating : 0;
    const roundedRating = Math.round(rating * 100) / 100;
    const fullStars = Math.floor(roundedRating);
    const remainder = roundedRating - fullStars;
  
    const starsArray: boolean[] = Array.from({ length: 5 }, (_, index) => {
      if (index < fullStars) {
        return true;
      } else if (index === fullStars && remainder >= 0.5) {
        return true;
      } else {
        return false;
      }
    });
  
    return starsArray;
  }  
}
