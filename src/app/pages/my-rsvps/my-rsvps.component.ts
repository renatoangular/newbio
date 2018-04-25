import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ApiService } from './../../core/api.service';
import { UtilsService } from './../../core/utils.service';
import { FilterSortService } from './../../core/filter-sort.service';
import { Subscription } from 'rxjs/Subscription';
import { EventModel } from './../../core/models/event.model'; 
import { AuthService } from '../../services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-my-rsvps',
  templateUrl: './my-rsvps.component.html',
  styleUrls: ['./my-rsvps.component.scss']
})
export class MyRsvpsComponent implements OnInit, OnDestroy {
  pageTitle = 'My Open House RSVPs';
  eventListSub: Subscription;
  eventList: EventModel[];
  loading: boolean;
  error: boolean;
  userIdp: string;

  constructor(
    private title: Title,
    public auth: AuthService,
    private api: ApiService,
    public fs: FilterSortService,
    public utils: UtilsService,
    public userService: UserService,
    jwtHelper: JwtHelperService
  ) { }

  ngOnInit() {
    console.log(this.auth.loggedIn);
    console.log(this.auth.isAdmin);
    this.title.setTitle(this.pageTitle);
    this.userIdp = 'testing'; // this._getIdp;
    this._getEventList();
  }

  private _getEventList() {
    this.loading = false;
    // Get events user has RSVPed to
    console.log(this.auth.currentUser);
    this.eventListSub = this.api
      .getUserEvents$(this.auth.currentUser._id)
      .subscribe(
        res => {
          this.eventList = res;
          this.loading = false;
        },
        err => {
          console.log(err);
          this.loading = false;
          this.error = true;
        }
      );
  }

  /* private get _getIdp(): string {
     const sub = this.auth2.currentUser.email.split('|')[0];
     let idp = sub;
 
     if (sub === 'auth0') {
       idp = 'Username/Password';
     } else if (idp === 'google-oauth2') {
       idp = 'Google';
     } else {
       idp = this.utils.capitalize(sub);
     }
     return idp;
   } */

  ngOnDestroy() {
    this.eventListSub.unsubscribe();
  }

}
