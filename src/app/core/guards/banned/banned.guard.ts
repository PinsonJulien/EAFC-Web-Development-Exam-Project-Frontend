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

  /**
  * Protect routes by checking if the user has the banned site role.
  * If it does, the route is redirected to /banned
  * If it doesn't or, he isn't logged in, pass the guard.
  *
  * @param route ActivatedRouteSnapshot
  * @param state RouterStateSnapshot
  * @returns Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
  */
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
