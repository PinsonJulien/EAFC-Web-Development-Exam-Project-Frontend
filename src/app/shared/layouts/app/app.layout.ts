import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import User from "src/app/core/models/User";
import AuthStoreService from "src/app/core/services/store/auth.store.service";
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { ApiError } from "src/app/core/types/api/api-error";

@Component({
  standalone: true,
  selector: 'app-layout',
  templateUrl: 'app.layout.html',
  styleUrls: ['app.layout.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    RouterModule,
    MatSnackBarModule,
  ]
})
export class AppLayout implements OnInit
{
  constructor(
    private authStoreService: AuthStoreService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    //
  }

  ngOnInit(): void {
    // Get the current user in store.
    this.user = this.authStoreService.user;

    // Update the isAdminRoute property
    this.updateIsAdminRoute();

    // Listen to any change on user store
    this.authStoreService.user$.subscribe((user: User|null) => {
      // If there's no user, it was logged out, so we return to the login page.
      if (!user)
        this.router.navigate(['login']);

      this.user = user;
    });

    // Listen to user store errors.
    this.authStoreService.error$.subscribe((error: ApiError | null) => {
      if (!error) return;

      this.snackBar.open(error.message, 'close');
    });

    // Listen to router navigation changes.
    this.isAdminRoute = this.router.url.startsWith('/admin');

    this.router.events.subscribe({
      next: (event) => {
        // Update the isAdminRoute every navigation change.
        if (event instanceof NavigationEnd)
          this.updateIsAdminRoute();
      }
    });
  }

  // Properties

  public user!: User | null;
  public isAdminRoute: boolean = false;

  // Methods

  /**
   * Logout action for the button.
   * On success it will remove this user from the store and trigger the init observer.
   *
   * @returns void
   */
  public logout(): void
  {
    this.authStoreService.logout();
  }

  /**
   * Update the isAdminRoute property using the router.
   *
   * @returns void
   */
  public updateIsAdminRoute(): void
  {
    this.isAdminRoute = this.router.url.startsWith('/admin');
  }
}
