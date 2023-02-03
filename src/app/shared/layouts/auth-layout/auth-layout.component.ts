import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  standalone: true,
  selector: 'auth-layout',
  templateUrl: 'auth-layout.component.html',
  styleUrls: ['auth-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class AuthLayoutComponent
{
  constructor(
  ) {
    //
  }
}
