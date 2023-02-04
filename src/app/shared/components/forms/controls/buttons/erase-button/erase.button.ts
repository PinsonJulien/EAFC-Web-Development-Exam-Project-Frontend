import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { MatIconModule } from "@angular/material/icon";

@Component({
  standalone: true,
  selector: 'erase-button[control]',
  templateUrl: 'erase.button.html',
  styleUrls: ['erase.button.scss'],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
})
export class EraseButton {

  constructor() {}

  @Input()
  public control!: FormControl<any>;
}
