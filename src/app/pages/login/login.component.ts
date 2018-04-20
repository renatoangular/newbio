import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../../authentication.service';
import { Router } from '@angular/router';
import { ApiService } from '../../core/api.service';

@Component({
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  credentials: TokenPayload = {
    email: '',
    password: ''
  };
  // login, if successful take user to profile page
  login() {
    this.auth2.login(this.credentials).subscribe(() => {
      this.router.navigateByUrl('/profile');
    }, (err) => {
      console.error(err);
    });
  }
  constructor(private api: ApiService, public auth2: AuthenticationService, private router: Router) { }

  ngOnInit() {
    if (this.auth2.isLoggedIn()) {
      this.router.navigateByUrl('/profile');
    }

  }
}
