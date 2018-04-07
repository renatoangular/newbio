import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from './../../../auth/auth.service';
import { ApiService } from './../../../core/api.service';
import { UtilsService } from './../../../core/utils.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { DonationsModel } from '../../../core/models/donations.model';

@Component({
  selector: 'app-update-donation',
  templateUrl: './update-donation.component.html',
  styleUrls: ['./update-donation.component.scss']
})
export class UpdateDonationComponent implements OnInit, OnDestroy {
  pageTitle = 'Update donation';
  routeSub: Subscription;
  donationSub: Subscription;
  donation: DonationsModel;
  loading: boolean;
  submitting: boolean;
  error: boolean;
  tabSub: Subscription;
  tab: string;
  private _id: string;

  constructor(
    private route: ActivatedRoute,
    public auth: AuthService,
    private api: ApiService,
    public utils: UtilsService,
    private title: Title) { }

  ngOnInit() {
    this.title.setTitle(this.pageTitle);

    // Set donation ID from route params and subscribe
    this.routeSub = this.route.params
      .subscribe(params => {
        this._id = params['id'];
        this._getDonation();
      });

    // Subscribe to query params to watch for tab changes
    this.tabSub = this.route.queryParams
      .subscribe(queryParams => {
        this.tab = queryParams['tab'] || 'edit';
      });
  }

  private _getDonation() {
    this.loading = true;
    // GET donation by ID
    this.donationSub = this.api
      .getDonationsById$(this._id)
      .subscribe(
        res => {
          this.donation = res;
          this.loading = false;
        },
        err => {
          console.error(err);
          this.loading = false;
          this.error = true;
        }
      );
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.tabSub.unsubscribe();
    this.donationSub.unsubscribe();
  }

}
