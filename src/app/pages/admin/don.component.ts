import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from './../../auth/auth.service';
import { ApiService } from './../../core/api.service';
import { UtilsService } from './../../core/utils.service';
import { FilterSortService } from './../../core/filter-sort.service';
import { Subscription } from 'rxjs/Subscription';
import { DonationsModel } from '../../core/models/donations.model';

@Component({
  selector: 'app-don',
  templateUrl: './don.component.html',
  styleUrls: ['./don.component.scss']
})
export class DonComponent implements OnInit, OnDestroy {
  pageTitle = 'Admin';
  donationsSub: Subscription;
  donationsList: DonationsModel[];
  filteredDonations: DonationsModel[];
  loading: boolean;
  error: boolean;
  query = '';

  constructor(
    private title: Title,
    public auth: AuthService,
    private api: ApiService,
    public utils: UtilsService,
    public fs: FilterSortService) { }

  ngOnInit() {
    this.title.setTitle(this.pageTitle);
    this._getDonationList();
  }

  private _getDonationList() {
    this.loading = true;
    // Get all (admin) events
    this.donationsSub = this.api
      .getAdminDonations$()
      .subscribe(
        res => {
          this.donationsList = res;
          this.filteredDonations = res;
          this.loading = false;
        },
        err => {
          console.error(err);
          this.loading = false;
          this.error = true;
        }
      );
  }

   searchDonations() {
    this.filteredDonations = this.fs.search(this.donationsList, this.query, '_id', 'mediumDate');
  }

  resetQuery() {
    this.query = '';
    this.filteredDonations = this.donationsList;
  }

  ngOnDestroy() {
    this.donationsSub.unsubscribe();
  }

}
