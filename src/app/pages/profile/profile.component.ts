import { Component, OnInit, OnDestroy } from '@angular/core'; 
import { ApiService } from '../../core/api.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../services/auth.service';

@Component({
  templateUrl: './profile.component.html'
})

export class ProfileComponent implements OnInit, OnDestroy {
  profileSub: Subscription;
  credentials:  {
    email: '',
    name: '',
    password: '',
    getnewsletter: false,
    isadmin: false
  };
  constructor(private api: ApiService,
    private auth: AuthService,
    private router: Router) { }

  ngOnInit() {

    this.profileSub = this.api
      .getProfile$()
      .subscribe(user => {
        this.credentials = user;
      }, () => (err) => {
        console.error(err);
      });


  }

  ngOnDestroy(): void {
    this.profileSub.unsubscribe();
  }
}
