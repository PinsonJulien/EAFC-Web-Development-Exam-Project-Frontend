import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { matchValidator } from 'src/app/shared/validators/match-validator';
import { FormField } from 'src/app/shared/ui/forms/fields/form-field/form.field';
import { Router } from '@angular/router';
import Country from '../core/models/Country';
import CountryService from '../core/services/country.service';
import AuthService from '../core/services/auth.service';
import { FormFieldOption } from '../shared/ui/forms/types/FormFieldOption';

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
    private authService: AuthService,
    private countryService: CountryService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Fetch the list of countries to populate selects.

    this.countryService.get().subscribe({
      next: (countries) => {
        this.countryOptions = countries.map((country: Country): FormFieldOption => {
          return {
            label: country.name,
            value: country.id,
          }
        });
      },
      error: (error) => {
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

  protected picture = new FormControl<File|null>(null, []);

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
    picture: this.picture,
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
      birthdate: new Date(this.birthdate.value ?? ''),
      address: this.address.value ?? '',
      postalCode: this.postalCode.value ?? '',
      addressCountryId: this.addressCountry.value ?? 0,
      phone: this.phone.value ?? '',
    };
    console.log(this.nationality)
    console.log(body)

    this.authService.register(body).subscribe({
      next: (v) => {
        // Save the user

        // Notify
        this.snackBar.open('Your account was successfully created !', 'close', {
          duration: 300
        });

        // Redirect
        this.router.navigate(['home']);
      },
      error: (e) => {
        this.snackBar.open(e.error.message, 'close', {
          duration: 3000
        });
      },
      complete: () => {}
    });
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
