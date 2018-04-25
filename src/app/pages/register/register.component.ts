import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../../core/api.service';
import { NavController, Content, Slides } from 'ionic-angular';
import { RegisterModel, FormRegisterModel } from '../../core/models/register.model';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { DatePipe } from '@angular/common';
import { RegisterFormService } from './register-form.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';


@Component({
  templateUrl: './register.component.html',
  providers: [RegisterFormService]
})
export class RegisterComponent implements OnInit, OnDestroy {


  credentials: {
    email: '',
    name: '',
    password: '',
    isadmin: true,
    getnewsletter: true

  };

  register: RegisterModel;
  isEdit: boolean;
  registerForm: FormGroup;

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
    private userService: UserService,
    private datePipe: DatePipe,
    public ef: RegisterFormService,
    private router: Router) { }

  ngOnInit() {
    this.formErrors = this.ef.formErrors;
    this.isEdit = !!this.register;
    this.submitBtnText = this.isEdit ? 'Update Profile' : 'Register';
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
        Validators.email
      ]],
      password: [this.formRegister.password, [
        Validators.required
      ]],
      name: [this.formRegister.name, [
        Validators.required
      ]],
      getnewsletter: [this.formRegister.getnewsletter, [
        Validators.required
      ]],
      isadmin: [this.formRegister.isadmin, [
        Validators.required
      ]]
    });

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
        }
      }
    }
  }


  private _getSubmitObj() {
    // Convert form startDate/startTime and endDate/endTime
    // to JS dates and populate a new RegisterModel for submission
    return new RegisterModel(
      this.registerForm.get('email').value,
      this.registerForm.get('name').value,
      this.registerForm.get('password').value,
      this.registerForm.get('isadmin').value,
      this.registerForm.get('getnewsletter').value,
      this.register ? this.register._id : null
    );
  }

  onSubmit() {
    this.submitting = true;
    this.submitRegisterObj = this._getSubmitObj();

    if (!this.isEdit) {
      this.submitRegisterSub =
        this.userService.register(this.submitRegisterObj)
          .subscribe(
            data => this._handleSubmitSuccess(data),
            err => this._handleSubmitError(err)
          );
    } else {
      this.submitRegisterSub = this.api
        .editRegister$(this.register._id, this.submitRegisterObj)
        .subscribe(
          data => this._handleSubmitSuccess(data),
          err => this._handleSubmitError(err))

    }
  }

  register1() {
    this.submitRegisterSub =
      this.userService.register(this.credentials).subscribe(() => {
        this.router.navigateByUrl('/login');
      }, (err) => {
        console.error(err);
      });
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

  private _handleSubmitSuccess(res) {
    this.error = false;
    this.submitting = false;
    // Redirect to register detail
    this.router.navigate(['/']);      //  , res._id]);
  }

  private _handleSubmitError(err) {
    console.error(err);
    this.submitting = false;
    this.error = true;
  }

}
