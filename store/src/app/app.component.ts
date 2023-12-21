import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'store';

  hideHeaderFooter: boolean = false;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (['/register', '/login', '/not-found'].includes(event.url)) {
          this.hideHeaderFooter = true;
        } else {
          this.hideHeaderFooter = false;
        }
      }
    });
  }
}
