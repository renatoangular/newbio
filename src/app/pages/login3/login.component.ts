import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../services/auth.service';
import { AuthenticationService } from '../../authentication.5555service';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { ToastComponent } from '../../core/toast/toast.component';

@Component({
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  email = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(100)
  ]);
  t: ToastComponent
  username: String;
  password: String;
  credentials: {
    email: '',
    password: ''
  };
  // login, if successful take user to profile page
  login() {

    console.log('the credentials at login comp' + this.credentials);
    this.auth.login(this.loginForm.value).subscribe(() => {
      this.router.navigateByUrl('/profile');
    }, (err) => {
      console.error(err);
    })
  }
  constructor(private api: ApiService,
    public auth: AuthService,
    private router: Router,
    private authenticationService: AuthenticationService,
    public toast: ToastComponent
  ) { }

  ngOnInit() {
    if (this.auth.loggedIn) {
      this.router.navigateByUrl('/profile');
    }

  }
  onLoginSubmit() {
    const user = {
      username: this.credentials.email,
      password: this.credentials.password
    };
  }
}
