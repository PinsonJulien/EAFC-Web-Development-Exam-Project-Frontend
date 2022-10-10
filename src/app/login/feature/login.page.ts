import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/data-access/auth/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  providers: [
    // Auto check every fields on change and submit.
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher}
  ]
})
export class LoginPage {
  public loginForm = new FormGroup({
    email : new FormControl<string|null>(null, [
      Validators.required,
      Validators.email,
    ]),
    password : new FormControl<string|null>(null, [
      Validators.required,
      Validators.minLength(8),
    ])
  });

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) {}

  public onSubmit() {
    if (this.getEmailErrorMessage() !== '') return;
    if (this.getPasswordErrorMessage() !== '') return;

    const email = this.getEmail()?.value || '';
    const password = this.getPassword()?.value || '';

    this.authService.login(email, password)
    .subscribe({
      next: (v) => console.log("success" + v),
      error: (e) => {
        const status: number = e.status;
        let message = "";
        console.log(status);

        switch(status) {
          case 0:
            message = 'Server cannot be reached';
            break;
          case 422: // Probably not 422
            message = 'Invalid credentials';
            break;
          default:
            message = 'Undefined error';
            break;
        }

        this.snackBar.open(message, 'Undo', {
          duration: 3000
        });
      },
      complete: () => {}
    });
  }

  public getEmail() {
    return this.loginForm.get('email');
  }

  public getEmailErrorMessage() {
    const email = this.loginForm // this.getEmail();
    if (!email || email.hasError('required'))
      return 'You must enter a value.';
    else if (email.hasError('email'))
      return 'Not a valid email.'
    else
      return '';
  }

  public getPassword() {
    return this.loginForm.get('password');
  }

  public getPasswordErrorMessage() {
    const password = this.getPassword()
    if (!password || password.hasError('required'))
      return 'You must enter a value.';
    else if (password.hasError('minLength'))
      return 'The password must have minimum 8 characters'
    else
      return '';
  }
}
