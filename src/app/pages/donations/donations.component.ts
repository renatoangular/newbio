// src/app/pages/event/event.component.ts
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from './../../auth/auth.service';
import { ApiService } from './../../core/api.service';
import { UtilsService } from './../../core/utils.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { EventModel } from './../../core/models/event.model';
import { DonationsModel } from './../../core/models/donations.model';

@Component({
  selector: 'app-donations',
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.scss']
})
export class DonationsComponent implements OnInit, OnDestroy {
  @Input() donation: DonationsModel;

  pageTitle: string;
  id: string;
  routeSub: Subscription;
  tabSub: Subscription;
  donationsSub: Subscription;
  donations: DonationsModel;
  loading: boolean;
  error: boolean;
  tab: string;
  donationsCheckedOut: boolean;

  constructor(
    private route: ActivatedRoute,
    public auth: AuthService,
    private api: ApiService,
    public utils: UtilsService,
    private title: Title) { }

  ngOnInit() {
    // Set event ID from route params and subscribe
    this.routeSub = this.route.params
      .subscribe(params => {
        this.id = params['id'];
        this._getDonations();
      });

    // Subscribe to query params to watch for tab changes
    this.tabSub = this.route.queryParams
      .subscribe(queryParams => {
        this.tab = queryParams['tab'] || 'details';
      });
  }

  private _getDonations() {
    this.loading = true;
    // GET donation by ID
    this.donationsSub = this.api
      .getDonationsById$(this.id)
      .subscribe(
        res => {
          this.donations = res;
          this._setPageTitle(this.donations.itemName);
          this.loading = false;
          // this.donationsCheckedOut = this.utils.donationsCheckedOut(this.donations.endDatetime);
        },
        err => {
          console.error(err);
          this.loading = false;
          this.error = true;
          this._setPageTitle('Donations Details');
        }
      );
  }

  private _setPageTitle(title: string) {
    this.pageTitle = title;
    this.title.setTitle(title);
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.tabSub.unsubscribe();
    this.donationsSub.unsubscribe();
  }

}

