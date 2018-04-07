import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from './../../../../auth/auth.service';
import { Subscription } from 'rxjs/Subscription';
import { ApiService } from './../../../../core/api.service';
import { DcommentModel } from './../../../../core/models/dcomment.model';
import { GUESTS_REGEX } from './../../../../core/forms/formUtils.factory';

@Component({
  selector: 'app-dcomment-form',
  templateUrl: './dcomment-form.component.html',
  styleUrls: ['./dcomment-form.component.scss']     //  testing
})

export class DcommentFormComponent implements OnInit, OnDestroy {
  @Input() eventId: string;
  @Input() dcomment: DcommentModel;
  @Output() submitDcomment = new EventEmitter();
  GUESTS_REGEX = GUESTS_REGEX;
  isEdit: boolean;
  formDcomment: DcommentModel;
  submitDcommentSub: Subscription;
  submitting: boolean;
  error: boolean;

  constructor(
    private auth: AuthService,
    private api: ApiService) { }

  ngOnInit() {
    this.isEdit = !!this.dcomment;
    this._setformDcomment();
  }

  private _setformDcomment() {
    if (!this.isEdit) {
      // If creating a new RSVP,
      // create new RsvpModel with default data
      this.formDcomment = new DcommentModel(
        this.auth.userProfile.sub,
        this.auth.userProfile.name,
        this.eventId,
        true,
        1,
        null
      );
    } else {
      // If editing an existing RSVP,
      // create new RsvpModel from existing data
      this.formDcomment = new DcommentModel(
        this.dcomment.userId,
        this.dcomment.name,
        this.dcomment.eventId,
        this.dcomment.wishList,
        this.dcomment.numberWished,
        this.dcomment.comments,
        this.dcomment._id
      );
    }
  }

  changeAttendanceSetGuests() {
    // If attendance changed to no, set guests: 0
    if (!this.formDcomment.wishList) {
      this.formDcomment.numberWished = 0;
    }
  }

  onSubmit() {
    this.submitting = true;
    if (!this.isEdit) {
      this.submitDcommentSub = this.api
        .postDcomment$(this.formDcomment)
        .subscribe(
          data => this._handleSubmitSuccess(data),
          err => this._handleSubmitError(err)
        );
    } else {
      this.submitDcommentSub = this.api
        .editDcomment$(this.dcomment._id, this.formDcomment)
        .subscribe(
          data => this._handleSubmitSuccess(data),
          err => this._handleSubmitError(err)
        );
    }
  }

  private _handleSubmitSuccess(res) {
    const eventObj = {
      isEdit: this.isEdit,
      dcomment: res
    };
    this.submitDcomment.emit(eventObj);
    this.error = false;
    this.submitting = false;
  }

  private _handleSubmitSuccess1(res) {
    const eventObj = {
      isEdit: this.isEdit,
      rsvp: res
    };
    this.submitDcomment.emit(eventObj);
    this.error = false;
    this.submitting = false;
  }

  private _handleSubmitError(err) {
    const eventObj = {
      isEdit: this.isEdit,
      error: err
    };
    this.submitDcomment.emit(eventObj);
    console.error(err);
    this.submitting = false;
    this.error = true;
  }

  ngOnDestroy() {
    if (this.submitDcommentSub) {
      this.submitDcommentSub.unsubscribe();
    }
  }

}
