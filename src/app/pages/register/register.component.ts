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
    password: '',
    getNewsletter: false
  };

  constructor(private api: ApiService, private auth: AuthenticationService, private router: Router) {}

  register() {
    this.api
      .postRegister$(this.credentials)
      .subscribe(() => {
        this.router.navigateByUrl('/');
      }, (err) => {
        console.error(err);
      });
    }
  }
