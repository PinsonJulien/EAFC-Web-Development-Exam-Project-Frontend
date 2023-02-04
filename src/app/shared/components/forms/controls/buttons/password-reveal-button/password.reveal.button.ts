import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { MatIconModule } from "@angular/material/icon";

@Component({
  standalone: true,
  selector: 'password-reveal-button[control][input]',
  templateUrl: 'password.reveal.button.html',
  styleUrls: ['password.reveal.button.scss'],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
})
export class PasswordRevealButton {

  constructor() {}

  @Input()
  public control!: FormControl<any>;

  @Input()
  public input!: HTMLInputElement;
}
