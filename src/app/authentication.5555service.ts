import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { Router } from '@angular/router';
import { ENV } from './core/env.config';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export interface UserDetails {
  _id: string;
  email: string;
  name: string;
  exp: number;
  iat: number;
  isadmin: boolean;  // localStorage.getItem('isadmin') === 'true';
  getnewsletter: boolean,
  isLoggedIn: boolean;
}

interface TokenResponse {
  token: string;
}
export interface TokenPayload {
  email: string;
  password: string;
  name?: string;
  getnewsletter?: boolean;
  isadmin?: boolean;
}

@Injectable()
export class AuthenticationService {
  private token: string;
  // Create a stream of logged in status to communicate throughout app
  loggedIn: boolean;
  loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);
  currentUser: any;
  isAdmin: boolean;

  constructor(private http: HttpClient, private router: Router) {

    // const currentUser = this.getUserDetails();
    const lsProfile = localStorage.getItem('profile');

    if (this.tokenValid) {
      this.currentUser = JSON.parse(lsProfile);
      this.isAdmin = localStorage.getItem('isAdmin') === 'true';
      this.setLoggedIn(true);
    } else if (!this.tokenValid && lsProfile) {
      this.logout();
    }

  }

  private saveToken(token: string): void {
    localStorage.setItem('mean-token', token);
    this.token = token;
  }

  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('mean-token');

      let payload;
      if (this.token) {
        payload = this.token.split('.')[1];
        payload = window.atob(payload);
        console.log('payload at getUserDetails auth..svc.ts' + payload);
        console.log('this is the token at getToken auth..svc.ts' + this.token);
      }
    }
    return this.token;
  }

  public getUserDetails(): UserDetails {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);

      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  private _setSession(profile?) {
    localStorage.setItem('access_token', this.token);
    // If initial login, set profile and admin information
    if (profile) {
      localStorage.setItem('profile', JSON.stringify(profile));
      this.currentUser = profile;
      localStorage.setItem('isAdmin', this.isAdmin.toString());
    }
    // Update login status in loggedIn$ stream
    this.setLoggedIn(true);
    // Schedule access token renewal

  }


  private _getProfile(profile) {
    // Use access token to retrieve user's profile and set session
    if (profile) {
      this._setSession(profile);
    }

  }

  public isLoggedIn(): boolean {

    if (this.loggedIn) {
      return true
    } else {
      return false;
    }
  }

  private request(method: 'post' | 'get', type: 'login' | 'register' | 'profile', user?: TokenPayload): Observable<any> {
    let base;

    if (method === 'post') {
      base = this.http.post(`${ENV.BASE_API}${type}`, user);
    } else {
      base = this.http.get(`${ENV.BASE_API}${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` } });
    }

    const request = base.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
        //  console.log(data.token);
         // this.saveToken(data.token);
        //  this.setLoggedIn(true);
        }
        return data;
      })
    );

    return request;
  }

  public register(user: TokenPayload): Observable<any> {

    return this.request('post', 'register', user);
  }

  // postRegister

  public login(user: TokenPayload): Observable<any> {
   // this.setLoggedIn(true);
    return this.request('post', 'login', user);
  }

  public profile(): Observable<any> {
    return this.request('get', 'profile');
  }

  public logout(noRedirect?: boolean): void {

    this.token = '';
    window.localStorage.removeItem('mean-token');
    window.localStorage.removeItem('token');
    localStorage.removeItem('profile');
    this.currentUser = undefined;
    this.isAdmin = undefined;
    this.setLoggedIn(false);
    localStorage.removeItem('isAdmin');
    this.router.navigateByUrl('/login');
  }

  setLoggedIn(value: boolean) {
    // Update login status subject
    this.loggedIn$.next(value);
    this.loggedIn = value;
  }
  get tokenValid(): boolean {
    // Check if current time is past access token's expiration
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return Date.now() < expiresAt;
  }


}
