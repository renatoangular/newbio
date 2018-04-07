import { Component, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ApiService } from './../../../../core/api.service';
import { Router } from '@angular/router';
import { DonationsModel } from '../../../../core/models/donations.model';

@Component({
  selector: 'app-delete-donation',
  templateUrl: './delete-donation.component.html',
  styleUrls: ['./delete-donation.component.scss']
})
export class DeleteDonationComponent implements OnDestroy {
  @Input() donation: DonationsModel;
  confirmDelete: string;
  deleteSub: Subscription;
  submitting: boolean;
  error: boolean;

  constructor(
    private api: ApiService,
    private router: Router) { }

  removeDonation() {
    this.submitting = true;
    // DELETE event by ID
    this.deleteSub = this.api
      .deleteDonations$(this.donation._id)
      .subscribe(
        res => {
          this.submitting = false;
          this.error = false;
          console.log(res.message);
          // If successfully deleted event, redirect to Admin
          this.router.navigate(['/donations']);
        },
        err => {
          console.error(err);
          this.submitting = false;
          this.error = true;
        }
      );
  }

  ngOnDestroy() {
    if (this.deleteSub) {
      this.deleteSub.unsubscribe();
    }
  }

}
