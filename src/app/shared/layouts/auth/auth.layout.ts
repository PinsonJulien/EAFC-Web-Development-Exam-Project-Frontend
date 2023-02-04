import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatTabsModule } from "@angular/material/tabs";
import { RouterModule } from "@angular/router";

@Component({
  standalone: true,
  selector: 'auth-layout',
  templateUrl: 'auth.layout.html',
  styleUrls: ['auth.layout.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatTabsModule,
  ],
})
export class AuthLayout
{
  constructor(
    //
  ) {
    //
  }

  // Properties
  public readonly links = [
    {
      path: 'login',
      name: 'Login',
    },
    {
      path: 'register',
      name: 'Sign up',
    }
  ]
}
