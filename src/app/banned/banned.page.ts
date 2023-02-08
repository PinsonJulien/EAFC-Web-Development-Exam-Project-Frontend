import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { Router, RouterModule } from "@angular/router";
import { first, skip } from "rxjs";
import User from "../core/models/User";
import AuthStoreService from "../core/services/store/auth-store.service";

@Component({
  standalone: true,
  selector: 'app-banned',
  templateUrl: 'banned.page.html',
  styleUrls: ['banned.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
  ],
  providers: [
    //
  ],
})
export class BannedPage
{
  /************************************************************/
  //
  // Properties
  //
  /************************************************************/

  //

  /************************************************************/
  //
  // Constructor
  //
  /************************************************************/

  constructor(
    protected authStoreService: AuthStoreService,
    protected router: Router,
  ) {
    //
  }

  /************************************************************/
  //
  // Methods
  //
  /************************************************************/

  /**
   * Logout the user using the AuthStoreService logout method.
   *
   * @returns void
   */
  protected logout(): void
  {
    this.authStoreService.logout();

    // Listen the next user change, redirects to /home
    this.authStoreService.user$
    .pipe(skip(1), first())
    .subscribe((user: User|null) => {
      this.router.navigate(['home']);
    });
  }
}
