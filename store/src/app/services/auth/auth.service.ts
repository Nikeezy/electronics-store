import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookiesService } from '../cookies/cookies.service';

const DB_BASE_URL = 'http://localhost:8080/auth'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private cookieService: CookiesService) { }

  register(username: string, password: string) {
    return this.http.post(`${DB_BASE_URL}/register`, { username, password });
  }

  login(username: string, password: string) {
    return this.http.post(`${DB_BASE_URL}/login`, { username, password }, {withCredentials: true});
  }

  logout() {
    return this.http.post(`${DB_BASE_URL}/logout`, null, {withCredentials: true});
  }

  isLoggedIn(): boolean {
    return (this.cookieService.getUsernameCookie() !== '') && (this.cookieService.getSessionIdCookie() !== '');
  }
}
