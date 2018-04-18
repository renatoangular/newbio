import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ApiService } from './../../core/api.service';
import { UtilsService } from './../../core/utils.service';
import { FilterSortService } from './../../core/filter-sort.service';
import { Subscription } from 'rxjs/Subscription';
import { EventModel } from './../../core/models/event.model';
import { AuthService } from './../../auth/auth.service';
import { DonationsModel } from '../../core/models/donations.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  pageTitle = 'Open House Events';
  eventListSub: Subscription;
  donationsListSub: Subscription;

  eventList: EventModel[];
  donationsList: DonationsModel[];

  filteredEvents: EventModel[];
  filteredDonations: DonationsModel[];

  loading: boolean;
  loading1: boolean;

  error: boolean;
  error1: boolean;

  query: '';
  query1: '';

  constructor(
    private title: Title,
    public utils: UtilsService,
    private api: ApiService,
    public auth: AuthService,
    public fs: FilterSortService,
    public fs1: FilterSortService) { }

  ngOnInit() {
    this.title.setTitle(this.pageTitle);
    this._getDonationsList();
    this._getEventList();

  }

  private _getEventList() {
    this.loading = false;
    // Get future, public events
    this.eventListSub = this.api
      .getEvents$()
      .subscribe(
        res => {
          this.eventList = res;
          this.filteredEvents = res;
          this.loading = false;
        },
        err => {
          console.log(err);
          this.loading = false;
          this.error = true;
        }
      );
  }

  private _getDonationsList() {
    this.loading = false;
    // Get future, public events
    this.donationsListSub = this.api
      .getDonations$()
      .subscribe(
        res => {
          this.donationsList = res;
          this.filteredDonations = res;
          this.loading = false;
        },
        err => {
          console.log(err);
          this.loading = false;
          this.error = true;
        }
      );
  }

  searchEvents() {
    this.filteredEvents = this.fs.search(this.eventList, this.query, '_id', 'mediumDate');
  }

  searchDonations() {
    this.filteredDonations = this.fs.search(this.donationsList, this.query,  '_id', 'donatedDatetime');
  }

  resetQuery() {
    this.query = '' ;
    this.filteredEvents = this.eventList;
  }

  get noSearchResults(): boolean {
    return !!(!this.filteredEvents.length && this.query);
  }

  ngOnDestroy() {
    this.eventListSub.unsubscribe();
    this.donationsListSub.unsubscribe();
  }

}
