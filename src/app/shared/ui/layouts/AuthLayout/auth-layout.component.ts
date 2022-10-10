import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  standalone: true,
  selector: 'auth-layout',
  templateUrl: 'auth-layout.component.html',
  styleUrls: ['auth-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports:[
    RouterOutlet
  ]
})
export class AuthLayoutComponent {
  constructor(
  ) {}
}
