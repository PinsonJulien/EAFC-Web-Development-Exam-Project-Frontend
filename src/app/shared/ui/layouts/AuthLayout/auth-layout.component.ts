import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from "@angular/common";

@Component({
  standalone: true,
  selector: 'auth-layout',
  templateUrl: 'auth-layout.component.html',
  styleUrls: ['auth-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports:[
    CommonModule,
    RouterModule,
    MatCardModule,
    MatTabsModule,
  ]
})
export class AuthLayoutComponent {

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

  constructor(
  ) {}
}
