import { Component } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../../authentication.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../../core/api.service';
import { NavController, Content, Slides } from 'ionic-angular';


@Component({
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  credentials: TokenPayload = {
    email: '',
    name: '',
    password: '',
    isadmin: true,
    getnewsletter: true

  };

  constructor(private api: ApiService, private auth: AuthenticationService, private router: Router) {}

    register() {
      this.auth.register(this.credentials).subscribe(() => {
        this.router.navigateByUrl('/login');
      }, (err) => {
        console.error(err);
      });
    }
  }
