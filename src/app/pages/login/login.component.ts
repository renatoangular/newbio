import { Component } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../../authentication.service';
import { Router } from '@angular/router';
import { ApiService } from '../../core/api.service';

@Component({
  templateUrl: './login.component.html'
})
export class LoginComponent {
  credentials: TokenPayload = {
    email: '',
    password: ''
  };

  constructor(private api: ApiService, private auth: AuthenticationService, private router: Router) { }

  login() {
    /* console.log('login point...');
      this.auth.login(this.credentials).subscribe(() => {
        this.router.navigateByUrl('/profile');
      }, (err) => {
        console.error(err);
      });
    } */
    console.log(this.credentials);
    this.api
      .postLogin$(this.credentials)
      .subscribe(() => {
        this.router.navigateByUrl('/profile');
      }, (err) => {
        console.error(err);
      });
  }
}
