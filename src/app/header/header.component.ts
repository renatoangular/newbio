import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { AuthService } from './../auth/auth.service';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';
import { AuthenticationService, UserDetails } from '../authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() navToggled = new EventEmitter();
  navOpen = false;
  details: UserDetails;
  headerSub = Subscription;
  profileSub: Subscription;
  constructor(
    public auth2: AuthenticationService,
    private router: Router,
    public auth: AuthService
  ) { }

  ngOnInit() {
    // If nav is open after routing, close it
   this.profileSub = this.auth2.profile().subscribe(user => {
      this.details = user;
    }, (err) => {
      console.error(err);
    });
    this.router.events
      .filter(event => event instanceof NavigationStart && this.navOpen)
      .subscribe(event => this.toggleNav());
  }

  toggleNav() {
    this.navOpen = !this.navOpen;
    this.navToggled.emit(this.navOpen);
  }
  ngOnDestroy(): void {
    this.profileSub.unsubscribe();
 }

}
