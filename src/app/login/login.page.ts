import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import AuthStoreService from '../core/services/store/auth-store.service';
import User from '../core/models/User';
import { ApiError } from '../core/types/api/api-error';
import { FormField } from '../shared/components/forms/fields/form-field/form.field';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { first, skip } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
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
export class LoginPage
{
  /************************************************************/
  //
  // Properties
  //
  /************************************************************/

  protected email = new FormControl<string|null>(null, [
    Validators.required,
    Validators.email,
  ]);

  protected password = new FormControl<string|null>(null, [
    Validators.required,
  ]);

  // Form group
  protected loginForm = new FormGroup({
    email: this.email,
    password: this.password,
  });

  /************************************************************/
  //
  // Constructor
  //
  /************************************************************/

  constructor(
    protected snackBar: MatSnackBar,
    protected authStoreService: AuthStoreService,
    protected router: Router
  ) {
    //
  }

  /************************************************************/
  //
  // Methods
  //
  /************************************************************/

  /**
   * Sends the form data to the AuthStore login method.
   * On success: redirects to the /home page.
   * On failure: shows a error message.
   *
   * @returns void
   */
  protected onSubmit(): void
  {
    if (!this.loginForm.valid) return;

    const credentials = {
      email: this.email.value ?? '',
      password: this.password.value ?? '',
    }

    // Login using the given credentials.
    this.authStoreService.login(credentials);

    // Listen to the next value of user which will change with the login call.
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
   * Get the error message based on the email field error.
   *
   * @returns string
   */
  protected getEmailErrorMessage(): string
  {
    switch (true) {
      case this.email.hasError('required'):
        return 'You must enter a value.';
      case this.email.hasError('email'):
        return "The value entered is not a valid email.";
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
    switch (true) {
      case this.password.hasError('required'):
        return 'You must enter a value.';
      default :
        return '';
    }
  }
}
