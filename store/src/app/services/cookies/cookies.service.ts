import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CookiesService {

  constructor(private cookieService: CookieService) {}

  getUsernameCookie(): string {
    return this.cookieService.get('user');
  }

  getSessionIdCookie(): string {
    return this.cookieService.get('user_session');
  }
}
