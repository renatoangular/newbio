import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { JwtHelperService } from '@auth0/angular-jwt';

import { UserService } from './user.service';

import { User } from './user.model';

import 'rxjs/add/operator/map';
import { ApiService } from '../core/api.service'; 

@Injectable()
export class AuthService {
  loggedIn = false;
  isAdmin = false;

  currentUser = { _id: '', username: '', role: '' };

  constructor(private userService: UserService,
    private router: Router,
    private jwtHelper: JwtHelperService,
    private api: ApiService) {
    const token = localStorage.getItem('token');
    console.log('token at auth.service.ts' + token);
 /*   if (typeof token !== 'undefined') {
      if (token) {
        console.log('at auth.service.ts: token is ' + token);
        const decodedUser = this.decodeUserFromToken(token);
        this.setCurrentUser(decodedUser);
      }
    }*/
  }


  login(emailAndPassword) {
    return this.api.login(emailAndPassword).map(
      res => {
        console.log('this is the token at login function in a.s.ts ' + res);
        localStorage.setItem('token', res.token);
        // const decodedUser = this.decodeUserFromToken(res.token);
        // this.setCurrentUser(decodedUser);
        return this.loggedIn;
      }
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.loggedIn = false;
    this.isAdmin = false;
    this.currentUser = { _id: '', username: '', role: '' };
    this.router.navigate(['/']);
  }

  decodeUserFromToken(token) {
    return this.jwtHelper.decodeToken(token).user;
  }

  setCurrentUser(decodedUser) {
    this.loggedIn = true;
    this.currentUser._id = decodedUser._id;
    this.currentUser.username = decodedUser.username;
    this.currentUser.role = decodedUser.role;
    decodedUser.role === 'admin' ? this.isAdmin = true : this.isAdmin = false;
    delete decodedUser.role;
  }

}
