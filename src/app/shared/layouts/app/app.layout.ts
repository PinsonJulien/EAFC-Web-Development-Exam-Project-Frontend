import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import User from "src/app/core/models/User";
import AuthStoreService from "src/app/core/services/store/auth-store.service";
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { ApiError } from "src/app/core/types/api/api-error";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatButtonModule } from "@angular/material/button";
import { MatListModule } from "@angular/material/list";
import { first, skip } from "rxjs";

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
  /************************************************************/
  //
  // Properties
  //
  /************************************************************/

  public user!: User | null;
  public isAdminRoute: boolean = false;

  public leftDrawerPages: AppLayout['basePages'] = [];

  public basePages = [
    {
      name: 'Enrollments',
      path: 'enrollments'
    },
  ];

  public adminPages = [
    {
      name: 'Enrollments',
      path: '/admin/enrollments'
    },
  ];

  /************************************************************/
  //
  // Constructor
  //
  /************************************************************/

  constructor(
    private authStoreService: AuthStoreService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    //
  }

  /************************************************************/
  //
  // Implemented Methods
  //
  /************************************************************/

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

    // Listen to router navigation changes.
    this.isAdminRoute = this.router.url.startsWith('/admin');

    this.router.events.subscribe({
      next: (event: any) => {
        // Update the isAdminRoute every navigation change.
        if (event instanceof NavigationEnd)
          this.updateIsAdminRoute();
      }
    });
  }

  /************************************************************/
  //
  // Methods
  //
  /************************************************************/

  /**
   * Logout action for the button.
   * On success it will remove this user from the store and trigger the init observer.
   *
   * @returns void
   */
  public logout(): void
  {
    this.authStoreService.logout();

    // Listen to next user store error
    this.authStoreService.error$
    .pipe(skip(1), first())
    .subscribe((error: ApiError | null) => {
      if (!error) return;

      this.snackBar.open(error.message, 'close');
    });
  }

  /**
   * Update the isAdminRoute property using the router.
   *
   * @returns void
   */
  public updateIsAdminRoute(): void
  {
    this.isAdminRoute = this.router.url.startsWith('/admin');
    this.leftDrawerPages = (this.isAdminRoute)
      ? this.adminPages
      : this.basePages;
  }
}
