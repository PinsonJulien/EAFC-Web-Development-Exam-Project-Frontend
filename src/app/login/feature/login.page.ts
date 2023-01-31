import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/data-access/auth/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { FormField } from 'src/app/shared/ui/forms/fields/form-field/form.field';
import AuthTestService  from 'src/app/core/services/AuthService';
import CsrfService from 'src/app/core/services/CsrfService';

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
export class LoginPage {

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

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private as: AuthTestService,
    private cs: CsrfService
  ) {

    this.cs.getToken().subscribe({
      next: (data) => {
        console.log("cookies : ", document.cookie)

        console.log("lol wha", data)
        this.as.login({
          email: "administrator@site.com",
          password: "administrator"
        }).subscribe({
          next: (data) => {
            console.log('passed')
            console.log(data)
          },
          error: (err) => {
            console.log('failed')
            console.error(err)
          }
        })
      },
      error: (error) => {
        console.error(error)
      }

    });


  }

  public async onSubmit() {
    if (this.getEmailErrorMessage() !== '') return;
    if (this.getPasswordErrorMessage() !== '') return;

    const email = this.email?.value || '';
    const password = this.password?.value || '';

    (await this.authService.login(email, password))
    .subscribe({
      next: (v) => {},
      error: (e) => {
        const status: number = e.status;
        let message = "";

        switch(status) {
          case 0:
            message = 'Server cannot be reached';
            break;
          case 422:
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
    else if (this.password.hasError('minlength'))
      return 'The password must have minimum 8 characters'
    else
      return '';
  }
}
