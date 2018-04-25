import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ApiService } from './../../core/api.service';
import { RegisterModel, FormRegisterModel } from './../../core/models/register.model';
import { DatePipe } from '@angular/common';
import { dateValidator } from './../../core/forms/date.validator';
import { dateRangeValidator } from './../../core/forms/date-range.validator';
import { DATE_REGEX, TIME_REGEX, stringsToDate } from './../../core/forms/formUtils.factory';
import { RegisterFormService } from './register-form.service'; 
import { AuthService } from '../../auth/auth99.service';


@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
  providers: [RegisterFormService]
})

export class RegisterFormComponent implements OnInit, OnDestroy {
  register: RegisterModel;
  isEdit: boolean;
  // FormBuilder form
  registerForm: FormGroup;
  datesGroup: AbstractControl;
  // Model storing initial form values
  formRegister: FormRegisterModel;
  // Form validation and disabled logic
  formErrors: any;
  formChangeSub: Subscription;
  // Form submission
  submitRegisterObj: RegisterModel;
  submitRegisterSub: Subscription;
  error: boolean;
  submitting: boolean;
  submitBtnText: string;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private auth: AuthService,
    private datePipe: DatePipe,
    public ef: RegisterFormService,
    private router: Router) { }

  ngOnInit() {
    this.formErrors = this.ef.formErrors;
    this.isEdit = !!this.register;
    this.submitBtnText = this.isEdit ? 'Update Register' : 'Create Register';
    // Set initial form data
    this.formRegister = this._setFormRegister();
    // Use FormBuilder to construct the form
    this._buildForm();
  }

  private _setFormRegister() {
    if (!this.isEdit) {
      // If creating a new register, create new
      // FormRegisterModel with default null data
      return new FormRegisterModel(null, null, null, null, null);
    } else {

      return new RegisterModel(
        this.register.email,
        this.register.name,
        this.register.password,
        this.register.isadmin,
        this.register.getnewsletter

      )
    }
  }

  private _buildForm() {
    this.registerForm = this.fb.group({

      email: [this.formRegister.email, [
        Validators.required,
        Validators.minLength(this.ef.textMin),
        Validators.maxLength(this.ef.locMax)
      ]]
    });
    // Set local property to registerForm datesGroup control
    this.datesGroup = this.registerForm.get('datesGroup');

    // Subscribe to form value changes
    this.formChangeSub = this.registerForm
      .valueChanges
      .subscribe(data => this._onValueChanged());

    // If edit: mark fields dirty to trigger immediate
    // validation in case editing an register that is no
    // longer valid (for example, an register in the past)
    if (this.isEdit) {
      const _markDirty = group => {
        for (const i in group.controls) {
          if (group.controls.hasOwnProperty(i)) {
            group.controls[i].markAsDirty();
          }
        }
      };
      _markDirty(this.registerForm);
      _markDirty(this.datesGroup);
    }

    this._onValueChanged();
  }

  private _onValueChanged() {
    if (!this.registerForm) { return; }
    const _setErrMsgs = (control: AbstractControl, errorsObj: any, field: string) => {
      if (control && control.dirty && control.invalid) {
        const messages = this.ef.validationMessages[field];
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
          _setErrMsgs(this.registerForm.get(field), this.formErrors, field);
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

  private _getSubmitObj() {
    const startDate = this.datesGroup.get('startDate').value;
    const startTime = this.datesGroup.get('startTime').value;
    const endDate = this.datesGroup.get('endDate').value;
    const endTime = this.datesGroup.get('endTime').value;
    // Convert form startDate/startTime and endDate/endTime
    // to JS dates and populate a new RegisterModel for submission
    return new RegisterModel(
      this.registerForm.get('email').value,
      this.registerForm.get('name').value,
      this.registerForm.get('password').value,
      this.registerForm.get('isAdmin').value,
      this.registerForm.get('getnewsletter').value,
      this.register ? this.register._id : null
    );
  }

  onSubmit() {
    this.submitting = true;
    this.submitRegisterObj = this._getSubmitObj();

    if (!this.isEdit) {
      this.submitRegisterSub = this.api
        .postRegister$(this.submitRegisterObj)
        .subscribe(
          data => this._handleSubmitSuccess(data),
          err => this._handleSubmitError(err)
        );
    } else {
      this.submitRegisterSub = this.api
        .editRegister$(this.register._id, this.submitRegisterObj)
        .subscribe(
          data => this._handleSubmitSuccess(data),
          err => this._handleSubmitError(err)
        );
    }
 }


  private _handleSubmitSuccess(res) {
    this.error = false;
    this.submitting = false;
    // Redirect to register detail
    this.router.navigate(['/register', res._id]);
  }

  private _handleSubmitError(err) {
    console.error(err);
    this.submitting = false;
    this.error = true;
  }

  resetForm() {
    this.registerForm.reset();
  }

  ngOnDestroy() {
    if (this.submitRegisterSub) {
      this.submitRegisterSub.unsubscribe();
    }
    this.formChangeSub.unsubscribe();
  }

}
