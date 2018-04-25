import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../services/auth.service';
@Injectable()
export class AdminGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.auth.isAdmin) {
      console.log('admin.guard.ts: is an admin');
      return true;
    }
    console.log('admin.guard.ts: is NOT an admin');
    // this.router.navigate(['/']);
    return true;
  }

}
