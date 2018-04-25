import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router'; 
import { AuthService } from './services/auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate() {
    if (!this.auth.loggedIn) {
   //   this.router.navigateByUrl('/');
      return false;
    }
    return true;
  }
}
