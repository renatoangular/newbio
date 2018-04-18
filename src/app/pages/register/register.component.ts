import { Component } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../../authentication.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../../core/api.service';

@Component({
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  credentials: TokenPayload = {
    email: '',
    name: '',
    password: ''
  };

  constructor(private api: ApiService, private auth: AuthenticationService, private router: Router) {}

  register() {

    console.log('register point...');
   /* this.auth.register(this.credentials).subscribe(() => {
      this.router.navigateByUrl('/profile');
    }, (err) => {
      console.error(err);
    });  */

    this.api
      .postRegister$(this.credentials)
      .subscribe(() => {
        this.router.navigateByUrl('/');
      }, (err) => {
        console.error(err);
      });
    }
  }
