import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  providers: [AuthService]
})
export class NavComponent implements OnInit {
  @Output() navToggled = new EventEmitter();
  navOpen = false;

  constructor(
    public auth2: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService) { }

  ngOnInit() {
    this.router.events
      .filter(event => event instanceof NavigationStart)
      
  }

 
  ngOnDestroy(): void {
  }

  onLogoutClick() {
    this.auth2.logout();
    this.flashMessage.show('You are logged out', {
      timeout: 3000
    });
    this.router.navigate(['/login']);
    return false;
  }
}
