import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { expandCollapse } from './../../../core/expand-collapse.animation';
import { AuthService } from '../../../services/auth.service';
import { ApiService } from './../../../core/api.service';
import { UtilsService } from './../../../core/utils.service';
import { FilterSortService } from './../../../core/filter-sort.service';
import { DcommentModel } from './../../../core/models/dcomment.model';
// import { DcommentModel } from './../../../core/models/dcomment.model';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-dcomment',
  animations: [expandCollapse],
  templateUrl: './dcomment.component.html',
  styleUrls: ['./dcomment.component.scss']
})
export class DcommentComponent implements OnInit, OnDestroy {
  @Input() eventId: string;
  @Input() eventPast: boolean;
  dcommentsSub: Subscription;
  dcomments: DcommentModel[];
  loading: boolean;
  error: boolean;
  userDcomment: DcommentModel;
  totalwishList: number;
  footerTense: string;
  showEditForm: boolean;
  editBtnText: string;
  showAlldcomments = false;
  showdcommentsText = 'View All Comments';

  constructor(
    public auth: AuthService,
    private api: ApiService,
    public utils: UtilsService,
    public fs: FilterSortService) { }

  ngOnInit() {
    this.footerTense = !this.eventPast ? 'request this item' : 'Requested this item.';
    this._getdcomments();
    this.toggleEditForm(false);
  }

  private _getdcomments() {
    this.loading = true;
    // Get dcomments by event ID
    this.dcommentsSub = this.api
      .getDcommentsByEventId$(this.eventId)
      .subscribe(
        res => {
          this.dcomments = res;
          this._updatedcommentstate();
          this.loading = false;
        },
        err => {
          console.error(err);
          this.loading = false;
          this.error = true;
        }
      );
  }

  toggleEditForm(setVal?: boolean) {
    this.showEditForm = setVal !== undefined ? setVal : !this.showEditForm;
    this.editBtnText = this.showEditForm ? 'Cancel Edit' : 'Edit My Request';
  }

  toggleShowdcomments() {
    this.showAlldcomments = !this.showAlldcomments;
    this.showdcommentsText = this.showAlldcomments ? 'Hide Requests' : 'Show All Requests';
  }

  onSubmitDcomment(e) {
    if (e.dcomment) {
      this.userDcomment = e.dcomment;
      this._updatedcommentstate(true);
      this.toggleEditForm(false);
    }
  }

  private _updatedcommentstate(changed?: boolean) {
    // If RSVP matching user ID is already
    // in RSVP array, set as initial RSVP
    const _initialUserDcomment = this.dcomments.filter(dcomment => {
        return dcomment.userId === this.auth.currentUser._id;
      })[0];

    // If user has not RSVPed before and has made
    // a change, push new RSVP to local dcomments store
    if (!_initialUserDcomment && this.userDcomment && changed) {
      this.dcomments.push(this.userDcomment);
    }
    this._setUserDcommentGetwishList(changed);
  }

  private _setUserDcommentGetwishList(changed?: boolean) {
    // Iterate over dcomments to get/set user's RSVP
    // and get total number of wishList guests
    let guests = 0;
    const dcommentArr = this.dcomments.map(dcomment => {
      // If user has an existing RSVP
      if (dcomment.userId === this.auth.currentUser._id) {
        if (changed) {
          // If user edited their RSVP, set with updated data
          dcomment = this.userDcomment;
        } else {
          // If no changes were made, set userDcomment property
          // (This applies on ngOnInit)
          this.userDcomment = dcomment;
        }
      }
      // Count total number of attendees
      // + additional guests
      if (dcomment.wishList) {
        guests++;
        if (dcomment.numberWished) {
          guests += dcomment.numberWished;
        }
      }
      return dcomment;
    });
    this.dcomments = dcommentArr;
    this.totalwishList = guests;
  }

  ngOnDestroy() {
    this.dcommentsSub.unsubscribe();
  }

}
