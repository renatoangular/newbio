import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService, UserDetails, TokenPayload } from '../../authentication.service';
import { ApiService } from '../../core/api.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  templateUrl: './profile.component.html'
})

export class ProfileComponent implements OnInit, OnDestroy {
   profileSub: Subscription;
   details: UserDetails;
   credentials: TokenPayload = {
    email: '',
    name: '',
    password: '',
    getnewsletter: false,
    isadmin: false
  };
  constructor(private api: ApiService,
     private auth: AuthenticationService,
     private router: Router) {}

  ngOnInit() {

  this.profileSub =  this.api
      .getProfile$()
      .subscribe(user => {
        this.details = user;
      }, () => (err) => {
        console.error(err);
      });
    }

    ngOnDestroy(): void {
       this.profileSub.unsubscribe();
    }
  }
