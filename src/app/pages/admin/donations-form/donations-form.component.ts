import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ApiService } from './../../../core/api.service';
import { DonationsModel, FormDonationsModel } from './../../../core/models/donations.model';
import { DatePipe } from '@angular/common';
import { dateValidator } from './../../../core/forms/date.validator';
import { dateRangeValidator } from './../../../core/forms/date-range.validator';
import { DATE_REGEX, TIME_REGEX, stringsToDate } from './../../../core/forms/formUtils.factory';
import { DonationsFormService } from './donations-form.service';
import { Country } from './country';
import { ItemModel } from '../../../core/models/item.model';

import { FilterSortService } from './../../../core/filter-sort.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-donations-form',
  templateUrl: './donations-form.component.html',
  styleUrls: ['./donations-form.component.scss'],
  providers: [ DonationsFormService ]
})

export class DonationsFormComponent implements OnInit, OnDestroy {
  @Input() donation: DonationsModel;
  isEdit: boolean;
  itemsList: ItemModel[];

  filteredEvents: ItemModel[];

  query: '';
  // FormBuilder form
  donationsForm: FormGroup;
  datesGroup: AbstractControl;
  // Model storing initial form values
  formDonations: FormDonationsModel;
  // Form validation and disabled logic
  formErrors: any;
  formChangeSub: Subscription;
  // Form submission
  submitDonationsObj: DonationsModel;
  submitDonationsSub: Subscription;

  itemObject: ItemModel;
  getItemsSub: Subscription;

  error: boolean;
  submitting: boolean;
  submitBtnText: string;
  selectedCountry: string;
  flashMessage: FlashMessagesService;
  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private datePipe: DatePipe,
    public df: DonationsFormService,
    private router: Router,
    public fs: FilterSortService) { }

  ngOnInit() {
    this.formErrors = this.df.formErrors;
    this.isEdit = !!this.donation;
    this.submitBtnText = this.isEdit ? 'Update Donation' : 'Create Donation';
    // Set initial form data
    this.formDonations = this._setFormDonations();
    // Use FormBuilder to construct the form
    this._buildForm();
    this.getItems();
  }

  onSelect(statusId) {
    this.selectedCountry = statusId;
  }


  private _setFormDonations() {
    if (!this.isEdit) {
      // If creating a new event, create new
      // FormEventModel with default null data
      return new FormDonationsModel(null, null, null, null, null, null, null, null);
    } else {
      // If editing existing event, create new
      // FormEventModel from existing data
      // Transform datetimes:
      // https://angular.io/docs/ts/latest/api/common/index/DatePipe-pipe.html
      // _shortDate: 1/7/2017
      // 'shortTime': 12:05 PM
      const _shortDate = 'M/d/yyyy';
      return new FormDonationsModel(
        this.donation.itemName,
        this.donation.donatedBy,
        this.donation.MT,
        this.donation.quantity,
        this.selectedCountry,
        this.datePipe.transform(this.donation.donatedDatetime, _shortDate),
        this.donation.description,
        this.donation.viewPublic
      );
    }
  }
/*    public title: string,
    public location: string,
    public donatedDatetime: Date,
    public checkedOutDatetime: Date,
    public viewPublic: boolean,
    public description?: string

    */

  private _buildForm() {
    this.donationsForm = this.fb.group({
      itemName: [this.formDonations.itemName, [
        Validators.required,
        Validators.minLength(this.df.textMin),
        Validators.maxLength(this.df.titleMax)
      ]],
      donatedBy: [this.formDonations.donatedBy, [
        Validators.required,
        Validators.minLength(this.df.textMin),
        Validators.maxLength(this.df.locMax)
      ]],
      MT: [this.formDonations.MT, [
        Validators.required,
        Validators.minLength(this.df.textMin),
        Validators.maxLength(this.df.locMax)
      ]],
      quantity: [this.formDonations.quantity, [
        Validators.required
            ]],
      category: [this.formDonations.category, [
        Validators.required,
        Validators.minLength(this.df.textMin),
        Validators.maxLength(this.df.locMax)
      ]],
      viewPublic: [this.formDonations.viewPublic,
        Validators.required
      ],
      description: [this.formDonations.description,
        Validators.maxLength(this.df.descMax)
      ],
      datesGroup: this.fb.group({
        donatedDatetime: [this.formDonations.donatedDatetime, [
          Validators.required,
          Validators.maxLength(this.df.dateMax),
          Validators.pattern(DATE_REGEX),
          dateValidator()
        ]]
       }, {})
    });
    // Set local property to eventForm datesGroup control
    this.datesGroup = this.donationsForm.get('datesGroup');

    // Subscribe to form value changes
    this.formChangeSub = this.donationsForm
      .valueChanges
      .subscribe(data => this._onValueChanged());

    // If edit: mark fields dirty to trigger immediate
    // validation in case editing an event that is no
    // longer valid (for example, an event in the past)
    if (this.isEdit) {
      const _markDirty = group => {
        for (const i in group.controls) {
          if (group.controls.hasOwnProperty(i)) {
            group.controls[i].markAsDirty();
          }
        }
      };
      _markDirty(this.formDonations);
      _markDirty(this.datesGroup);
    }

    this._onValueChanged();
  }
  private _onValueChanged() {
    if (!this.donationsForm) { return; }
    const _setErrMsgs = (control: AbstractControl, errorsObj: any, field: string) => {
      if (control && control.dirty && control.invalid) {
        const messages = this.df.validationMessages[field];
        for (const key in control.errors) {
          if (control.errors.hasOwnProperty(key)) {
            errorsObj[field] += messages[key] + '<br>';
          }
        }
      }
    };

    // Check validation and set errors
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        if (field !== 'datesGroup') {
          // Set errors for fields not inside datesGroup
          // Clear previous error message (if any)
          this.formErrors[field] = '';
          _setErrMsgs(this.donationsForm.get(field), this.formErrors, field);
        } else {
          // Set errors for fields inside datesGroup
          const datesGroupErrors = this.formErrors['datesGroup'];
          for (const dateField in datesGroupErrors) {
            if (datesGroupErrors.hasOwnProperty(dateField)) {
              // Clear previous error message (if any)
              datesGroupErrors[dateField] = '';
              _setErrMsgs(this.datesGroup.get(dateField), datesGroupErrors, dateField);
            }
          }
        }
      }
    }
  }
  resetQuery() {
    this.query = '';
    this.filteredEvents = this.itemsList;
  }
  get noSearchResults(): boolean {
    return !!(!this.filteredEvents.length && this.query);
  }

  searchEvents() {
    this.filteredEvents = this.fs.search(this.itemsList, this.query, '_id');
  }

  private _getSubmitObj() {

    const donatedDatetime = this.datesGroup.get('donatedDatetime').value;
   // const checkedOutDatetime = this.datesGroup.get('checkedOutDatetime').value;

    return new DonationsModel(
      this.selectedCountry,
      this.donationsForm.get('donatedBy').value,
      this.donationsForm.get('quantity').value,
      this.donationsForm.get('MT').value,
                                   null,
      // this.donationsForm.get('category').value,
      this.datesGroup.get('donatedDatetime').value,
      this.donationsForm.get('description').value,
       this.donationsForm.get('viewPublic').value,
      this.donation ? this.donation._id : null
    );
  }

  onSubmit() {
    this.submitting = true;
    this.submitDonationsObj = this._getSubmitObj();

    if (!this.isEdit) {
      this.submitDonationsSub = this.api
        .postDonations$(this.submitDonationsObj)
        .subscribe(
          data => this._handleSubmitSuccess(data),
          err => this._handleSubmitError(err)
        );
    } else {
      this.submitDonationsSub = this.api
        .editDonations$(this.donation._id, this.submitDonationsObj)
        .subscribe(
          data => this._handleSubmitSuccess(data),
          err => this._handleSubmitError(err)
        );
    }
  }

   getItems () {
    // Get future, public events
    this.getItemsSub = this.api
      .getItems$()
      .subscribe(
        res => {
          this.itemsList = res;
          this.filteredEvents = res;
        },
        err => {
          console.log(err);
          this.error = true;
        }
      );
   }



  private _handleSubmitSuccess(res) {
    this.error = false;
    this.submitting = false;
    // Redirect to event detail]
    console.log(res);
    this.router.navigate(['/donadmin', res._id]);
  }

  private _handleGetItemsSuccess(res) {
    this.error = false;
    this.submitting = false;
    // Redirect to event detail]
    console.log(res);
    this.router.navigate(['/donadmin', res._id]);
  }

  private _handleSubmitError(err) {
    console.log(err.message);
    this.submitting = false;
    this.error = true;
  }

  resetForm() {
    this.donationsForm.reset();
  }

  ngOnDestroy() {
    if (this.submitDonationsSub) {
      this.submitDonationsSub.unsubscribe();
    }
    this.formChangeSub.unsubscribe();
  }

}
