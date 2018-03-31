import { Injectable } from '@angular/core';

@Injectable()
export class DonationsFormService {
  validationMessages: any;
  // Set up errors object
  formErrors = {
    itemName: '',
    donatedBy: '',
    viewPublic: '',
    description: '',
    datesGroup: {
      donatedDate: '',
       checkedOutDate: ''

    }
  };
  // Min/maxlength validation
  textMin = 3;
  titleMax = 60;
  locMax = 200;
  dateMax = 10;
  timeMax = 8;
  descMax = 2000;
  // Formats
  dateFormat = 'm/d/yyyy';
  timeFormat = 'h:mm AM/PM';

  constructor() {
    this.validationMessages = {
      itemName: {
        required: `Item Name is <strong>required</strong>.`,
        minlength: `Item Name must be ${this.textMin} characters or more.`,
        maxlength: `Item Name must be ${this.titleMax} characters or less.`
      },
      donatedBy: {
        required: `Donated By is <strong>required</strong>.`,
        minlength: `Location must be ${this.textMin} characters or more.`,
        maxlength: `Location must be ${this.locMax} characters or less.`
      },
      donatedDate: {
        required: `Donated date is <strong>required</strong>.`,
        maxlength: `Start date cannot be longer than ${this.dateMax} characters.`,
        pattern: `Start date must be in the format <strong>${this.dateFormat}</strong>.`,
        date: `Start date must be a <strong>valid date</strong> at least one day <strong>in the future</strong>.`
      },
      startTime: {
        required: `Start time is <strong>required</strong>.`,
        pattern: `Start time must be a <strong>valid time</strong> in the format <strong>${this.timeFormat}</strong>.`,
        maxlength: `Start time must be ${this.timeMax} characters or less.`
      },
      checkedOutDate: {
        required: `Checked date is <strong>NOT required</strong>.`,
        maxlength: `date cannot be longer than ${this.dateMax} characters.`,
        pattern: `date must be in the format <strong>${this.dateFormat}</strong>.`,
        date: `date must be a <strong>valid date</strong> at least one day <strong>in the future</strong>.`
      },

      viewPublic: {
        required: `You must specify whether this event should be publicly listed.`
      },
      description: {
        maxlength: `Description must be ${this.descMax} characters or less.`
      }
    };
  }

}
