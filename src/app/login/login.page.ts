import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { FormField } from 'src/app/shared/ui/forms/fields/form-field/form.field';
import AuthService  from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';

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
  constructor(
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) {}

  // Controls
  public email = new FormControl<string|null>(null, [
    Validators.required,
    Validators.email,
  ]);

  public password = new FormControl<string|null>(null, [
    Validators.required,
    Validators.minLength(8),
  ]);

  public loginForm = new FormGroup({
    email: this.email,
    password: this.password,
  });

  public onSubmit()
  {
    if (!this.loginForm.valid) return;

    const body = {
      email: this.email.value ?? '',
      password: this.password.value ?? '',
    }

    this.authService.login(body).subscribe({
      next: (data) => {
        // Set the user in store
        console.log(data);

        // redirect
        this.router.navigate(['home']);
      },
      error: (error) => {
        console.log(error)
        const status = error.status;
        const message = error.error.message;

        this.snackBar.open(message);
      }
    })

  }

  public getEmailErrorMessage()
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

  public getPasswordErrorMessage()
  {
    switch (true) {
      case this.password.hasError('required'):
        return 'You must enter a value.';
      default :
        return '';
    }
  }
}
