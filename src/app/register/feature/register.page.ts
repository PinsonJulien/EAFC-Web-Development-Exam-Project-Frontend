import { AuthService } from 'src/app/shared/data-access/auth/auth.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { matchValidator } from 'src/app/shared/validators/match-validator';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: 'register.page.html',
  styleUrls: ['register.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule
  ],
  providers: [
    // Auto check every fields on change and submit.
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher}
  ]
})
export class RegisterPage {
  // Controls
  public name = new FormControl<string|null>(null, [
    Validators.required
  ]);

  public email = new FormControl<string|null>(null, [
    Validators.required,
    Validators.email,
  ]);

  public password = new FormControl<string|null>(null, [
    Validators.required,
    Validators.minLength(8),
  ]);

  public passwordConfirmation = new FormControl<string|null>(null, [
    Validators.required,
    Validators.minLength(8),
    matchValidator(this.password),
  ]);

  // Form
  public registerForm: FormGroup = new FormGroup({
    name: this.name,
    email: this.email,
    password: this.password,
    passwordConfirmation: this.passwordConfirmation,
  });

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) {}

  // Methods
  public async onSubmit() {
    if (this.getNameErrorMessage() !== '') return;
    if (this.getEmailErrorMessage() !== '') return;
    if (this.getPasswordErrorMessage() !== '') return;
    if (this.getPasswordConfirmationErrorMessage() !== '') return;

    const name = this.name?.value || '';
    const email = this.email?.value || '';
    const password = this.password?.value || '';
    const passwordConfirmation = this.passwordConfirmation?.value || '';

    (await this.authService.register(name, email, password, passwordConfirmation))
    .subscribe({
      next: (v) => {
        // Redirection
        console.log("success")
      },
      error: (e) => {
        const status: number = e.status;
        let message = "";
        console.log("error !! " + status);

        switch(status) {
          case 0:
            message = 'Server cannot be reached';
            break;
          case 422:
            message = 'This email is already used.';
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

  public getNameErrorMessage() {
    if (this.name.hasError('required'))
      return 'You must enter a value.';
    else
      return '';
  }

  public getEmailErrorMessage() {
    if (this.email.hasError('required'))
      return 'You must enter a value.';
    else if (this.email.hasError('email'))
      return 'Not a valid email.'
    else
      return '';
  }

  public getPasswordErrorMessage() {
    if (this.password.hasError('required'))
      return 'You must enter a value.';
    if (this.password.hasError('minlength'))
      return 'The password must have minimum 8 characters';
    else
      return '';
  }

  public getPasswordConfirmationErrorMessage() {
    if (this.passwordConfirmation.hasError('required'))
      return 'You must enter a value.';
    else if (this.passwordConfirmation.hasError('minlength'))
      return 'The password must have minimum 8 characters';
    else if (this.passwordConfirmation.hasError('match'))
      return 'The password must the same than the previous one.'
    else
      return '';
  }
}
