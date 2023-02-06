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
  constructor(
    private authStoreService: AuthStoreService,
    private countryService: CountryApiService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {
    //
  }

  public ngOnInit(): void {
    // Listen to user being received upon successful register. Redirects to /home
    this.authStoreService.user$.subscribe((user: User|null) => {
      if (!user) return;

      this.router.navigate(['courses']);
    });

    // Listen to errors, they will be returned with a visual message.
    this.authStoreService.error$.subscribe((error: ApiError|null) => {
      if (!error) return;

      this.snackBar.open(error.message, 'close');
    });

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

  // Form
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

  // Methods
  protected async onSubmit() {
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

    this.authStoreService.register(body, this.picture);
  }

  protected uploadPicture(event: any) {
    if (event.target && event.target.files) {
      this.picture = event.target.files[0];
    }
  }

  // Validation messages

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

  protected getUsernameErrorMessage(): string
  {
    switch(true) {
      case this.username.hasError('required'):
        return 'You must enter a value.';
      default :
        return '';
    }
  }

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

  protected getLastnameErrorMessage(): string
  {
    switch(true) {
      case this.lastname.hasError('required'):
        return 'You must enter a value.';
      default :
        return '';
    }
  }

  protected getFirstnameErrorMessage(): string
  {
    switch(true) {
      case this.firstname.hasError('required'):
        return 'You must enter a value.';
      default :
        return '';
    }
  }

  protected getNationalityErrorMessage(): string
  {
    switch(true) {
      case this.nationality.hasError('required'):
        return 'You must select a value.';
      default :
        return '';
    }
  }

  protected getBirthdateErrorMessage(): string
  {
    switch(true) {
      case this.birthdate.hasError('required'):
        return 'You must enter a value.';
      default :
        return '';
    }
  }

  protected getAddressErrorMessage(): string
  {
    switch(true) {
      case this.address.hasError('required'):
        return 'You must enter a value.';
      default :
        return '';
    }
  }

  protected getPostalCodeErrorMessage(): string
  {
    switch(true) {
      case this.postalCode.hasError('required'):
        return 'You must enter a value.';
      default :
        return '';
    }
  }

  protected getAddressCountryErrorMessage(): string
  {
    switch(true) {
      case this.nationality.hasError('required'):
        return 'You must select a value.';
      default :
        return '';
    }
  }

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
