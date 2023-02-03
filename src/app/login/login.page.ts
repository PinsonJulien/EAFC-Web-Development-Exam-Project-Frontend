import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { FormField } from 'src/app/shared/ui/forms/fields/form-field/form.field';
import { Router } from '@angular/router';
import AuthStoreService from '../core/services/store/auth.store.service';
import User from '../core/models/User';

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
export class LoginPage implements OnInit
{
  constructor(
    private snackBar: MatSnackBar,
    private authStoreService: AuthStoreService,
    private router: Router
  ) {}

  public ngOnInit(): void
  {
    // Listen to user being received upon successful login. Redirects to /home
    this.authStoreService.user.subscribe((user: User|null) => {
      if (user)
        this.router.navigate(['home']);
    });

    // Listen to errors, they will be returned with a visual message.
    this.authStoreService.error.subscribe((error: string|null) => {
      if (error)
        this.snackBar.open(error);
    });
  }

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

    const credentials = {
      email: this.email.value ?? '',
      password: this.password.value ?? '',
    }

    this.authStoreService.login(credentials);
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
