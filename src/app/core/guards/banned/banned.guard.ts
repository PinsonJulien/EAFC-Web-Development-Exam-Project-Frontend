import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import AuthStoreService from "../../services/store/auth-store.service";

@Injectable({
  providedIn: 'root'
})
export class BannedGuard implements CanActivate
{
  /**************************************************/
  //
  // Constructor
  //
  /**************************************************/

  constructor(
    private router: Router,
    private authStoreService: AuthStoreService,
  ) {
    //
  }

  /**************************************************/
  //
  // Implemented methods
  //
  /**************************************************/

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
  {
    const redirect = 'banned';

    const user = this.authStoreService.user;
    // Allows unauthentified users.
    if (!user) return true;

    // Don't allow banned user
    if (user.isBanned()) return this.router.createUrlTree([redirect]);

    return true;
  }

}
