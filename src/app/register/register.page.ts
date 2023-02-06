import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { matchValidator } from 'src/app/shared/validators/match-validator';
import { Router } from '@angular/router';
import Country from '../core/models/Country';
import CountryApiService from '../core/services/api/country-api.service';
import AuthStoreService from '../core/services/store/auth-store.service';
import { RegisterRequestBody } from '../core/types/auth/register-request-body';
import User from '../core/models/User';
import { ApiError } from '../core/types/api/api-error';
import { FormField } from '../shared/components/forms/fields/form-field/form.field';
import { FormFieldOption } from '../shared/components/forms/types/FormFieldOption';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { skip } from 'rxjs/internal/operators/skip';
import { first } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: 'register.page.html',
  styleUrls: ['register.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSnackBarModule,
    FormField,
  ],
  providers: [
    // Auto check every fields on change and submit.
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher}
  ]
})
export class RegisterPage implements OnInit
{
  /************************************************************/
  //
  // Properties
  //
  /************************************************************/

  protected countryOptions!: FormFieldOption[];

  // Controls
  protected email = new FormControl<string|null>(null, [
    Validators.required,
    Validators.email,
  ]);

  protected username = new FormControl<string|null>(null, [
    Validators.required,
  ]);

  protected password = new FormControl<string|null>(null, [
    Validators.required,
    Validators.minLength(8),
  ]);

  protected passwordConfirmation = new FormControl<string|null>(null, [
    Validators.required,
    Validators.minLength(8),
    matchValidator(this.password),
  ]);

  protected lastname = new FormControl<string|null>(null, [
    Validators.required,
  ]);

  protected firstname = new FormControl<string|null>(null, [
    Validators.required,
  ]);

  protected nationality = new FormControl<number|null>(null, [
    Validators.required,
  ]);

  protected birthdate = new FormControl<Date|null>(null, [
    Validators.required,
  ]);

  protected address = new FormControl<string|null>(null, [
    Validators.required,
  ]);

  protected postalCode = new FormControl<string|null>(null, [
    Validators.required,
  ]);

  protected addressCountry = new FormControl<number|null>(null, [
    Validators.required,
  ]);

  protected phone = new FormControl<string|null>(null, [
    Validators.required,
    Validators.maxLength(50)
  ]);

  protected picture!: File;

  // Form group
  protected registerForm: FormGroup = new FormGroup({
    username: this.username,
    email: this.email,
    password: this.password,
    passwordConfirmation: this.passwordConfirmation,
    lastname: this.lastname,
    firstname: this.firstname,
    nationality: this.nationality,
    birthdate: this.birthdate,
    address: this.address,
    postCode: this.postalCode,
    addressCountry: this.addressCountry,
    phone: this.phone,
  });

  /************************************************************/
  //
  // Constructor
  //
  /************************************************************/

  constructor(
    protected authStoreService: AuthStoreService,
    protected countryService: CountryApiService,
    protected snackBar: MatSnackBar,
    protected router: Router,
  ) {
    //
  }

  /************************************************************/
  //
  // Implemented Methods
  //
  /************************************************************/

  public ngOnInit(): void
  {
    // Fetch the list of countries to populate selects.
    this.countryService.get().subscribe({
      next: (countries: Country[]) => {
        this.countryOptions = countries.map((country: Country): FormFieldOption => {
          return {
            label: country.name,
            value: country.id,
          }
        });
      },
      error: (error: any) => {
        this.snackBar.open(error.error.message);
      }
    });
  }

  /************************************************************/
  //
  // Methods
  //
  /************************************************************/

    /**
   * Sends the form data to the AuthStore register method.
   * On success: redirects to the /home page.
   * On failure: shows a error message.
   *
   * @returns void
   */
  protected onSubmit()
  {
    if (!this.registerForm.valid) return;

    const body: RegisterRequestBody = {
      email: this.email.value ?? '',
      username: this.username.value ?? '',
      password: this.password.value ?? '',
      password_confirmation: this.passwordConfirmation.value ?? '',
      lastname: this.lastname.value ?? '',
      firstname: this.firstname.value ?? '',
      nationalityCountryId: this.nationality.value ?? 0,
      birthdate:  (new Date(this.birthdate.value ?? '')).toISOString(),
      address: this.address.value ?? '',
      postalCode: this.postalCode.value ?? '',
      addressCountryId: this.addressCountry.value ?? 0,
      phone: this.phone.value ?? '',
    };

    // Try to register using the given data.
    this.authStoreService.register(body, this.picture);

    // Listen to the next value of user which will change with the register call.
    // If it succeeded, user is set and we navigate to /home
    this.authStoreService.user$
    .pipe(skip(1), first())
    .subscribe((user: User|null) => {
      if (!user) return;

      this.router.navigate(['home']);
    });

    // Listen to the next error
    this.authStoreService.error$
    .pipe(skip(1), first())
    .subscribe((error: ApiError|null) => {
      if (!error) return;

      this.snackBar.open(error.message, 'close');
    });
  }

  /**
   * Set the value of the picture property with the memory address of the input 'file'.
   *
   * @param event
   * @returns void
   */
  protected uploadPicture(event: any): void
  {
    if (event.target && event.target.files) {
      this.picture = event.target.files[0];
    }
  }

  /**
   * Get the error message based on the email field error.
   *
   * @returns string
   */
  protected getEmailErrorMessage(): string
  {
    switch(true) {
      case this.email.hasError('required'):
        return 'You must enter a value.';
      case this.email.hasError('email'):
        return "The value entered is not a valid email.";
      default :
        return '';
    }
  }

  /**
   * Get the error message based on the username field error.
   *
   * @returns string
   */
  protected getUsernameErrorMessage(): string
  {
    switch(true) {
      case this.username.hasError('required'):
        return 'You must enter a value.';
      default :
        return '';
    }
  }

  /**
   * Get the error message based on the password field error.
   *
   * @returns string
   */
  protected getPasswordErrorMessage(): string
  {
    switch(true) {
      case this.password.hasError('required'):
        return 'You must enter a value.';
      case this.password.hasError('minlength'):
        return 'The password must have minimum 8 characters.';
      default :
        return '';
    }
  }

  /**
   * Get the error message based on the confirmation password field error.
   *
   * @returns string
   */
  protected getPasswordConfirmationErrorMessage(): string
  {
    switch(true) {
      case this.password.hasError('required'):
        return 'You must enter a value.';
      case this.password.hasError('minlength'):
        return 'The password must have minimum 8 characters.';
      case this.password.hasError('match'):
        return 'The confirmation password must match the password.';
      default :
        return '';
    }
  }

  /**
   * Get the error message based on the lastname field error.
   *
   * @returns string
   */
  protected getLastnameErrorMessage(): string
  {
    switch(true) {
      case this.lastname.hasError('required'):
        return 'You must enter a value.';
      default :
        return '';
    }
  }

  /**
   * Get the error message based on the firstname field error.
   *
   * @returns string
   */
  protected getFirstnameErrorMessage(): string
  {
    switch(true) {
      case this.firstname.hasError('required'):
        return 'You must enter a value.';
      default :
        return '';
    }
  }

  /**
   * Get the error message based on the nationality field error.
   *
   * @returns string
   */
  protected getNationalityErrorMessage(): string
  {
    switch(true) {
      case this.nationality.hasError('required'):
        return 'You must select a value.';
      default :
        return '';
    }
  }

  /**
   * Get the error message based on the birthdate field error.
   *
   * @returns string
   */
  protected getBirthdateErrorMessage(): string
  {
    switch(true) {
      case this.birthdate.hasError('required'):
        return 'You must enter a value.';
      default :
        return '';
    }
  }

  /**
   * Get the error message based on the address field error.
   *
   * @returns string
   */
  protected getAddressErrorMessage(): string
  {
    switch(true) {
      case this.address.hasError('required'):
        return 'You must enter a value.';
      default :
        return '';
    }
  }

  /**
   * Get the error message based on the postal code field error.
   *
   * @returns string
   */
  protected getPostalCodeErrorMessage(): string
  {
    switch(true) {
      case this.postalCode.hasError('required'):
        return 'You must enter a value.';
      default :
        return '';
    }
  }

  /**
   * Get the error message based on the country field error.
   *
   * @returns string
   */
  protected getAddressCountryErrorMessage(): string
  {
    switch(true) {
      case this.nationality.hasError('required'):
        return 'You must select a value.';
      default :
        return '';
    }
  }

  /**
   * Get the error message based on the phone field error.
   *
   * @returns string
   */
  protected getPhoneErrorMessage(): string
  {
    switch(true) {
      case this.phone.hasError('required'):
        return 'You must enter a value.';
      default :
        return '';
    }
  }
}
