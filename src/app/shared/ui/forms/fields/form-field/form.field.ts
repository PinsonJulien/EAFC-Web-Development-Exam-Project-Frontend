import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { EraseButton } from "../../controls/buttons/erase-button/erase.button";
import { PasswordRevealButton } from "../../controls/buttons/password-reveal-button/password.reveal.button";

@Component({
  standalone: true,
  selector: 'form-field[form][control]',
  templateUrl: 'form.field.html',
  styleUrls: ['form.field.scss'],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    EraseButton,
    PasswordRevealButton,
  ],
})
export class FormField {
  constructor() {}

  @Input()
  public form!: FormGroup;

  @Input()
  public label: string = '';

  @Input()
  public control!: FormControl<any>;

  @Input()
  public autocomplete: HTMLInputElement['autocomplete'] = 'off';

  @Input()
  public type: 'select' | HTMLInputElement['type'] = 'text';

  @Input()
  public options: string[] = [];

  @Input()
  public error: string = '';
}
