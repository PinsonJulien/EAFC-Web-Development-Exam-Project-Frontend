import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import AuthStoreService from '../../services/store/auth-store.service';

@Injectable({
  providedIn: 'root'
})
export class SiteRoleGuard implements CanActivate {
  constructor(
    private router: Router,
    private authStoreService: AuthStoreService,
  ) {
    //
  }

  /**
   * Protect routes by checking if the user has a one of the specified roles.
   * Unauthentified users are returned to the redirect page.
   * Route datas :
   * - acceptedRoles  => Roles that can access the page.
   * - forbiddenRoles => Roles that cannot access the page.
   * - redirect       => Where the guard will redirect in role conflict.
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
    const redirect = route.data['redirect'] as string || '';

    const user = this.authStoreService.user;
    // requires to be authentified by default.
    if (!user) return this.router.createUrlTree([redirect]);

    const userSiteRoleId = user.account!.siteRole.id;
    // Cannot be in the forbidden roles
    const forbiddenRoles = route.data['forbiddenRoles'] as Array<number> || [];
    if (forbiddenRoles.length && forbiddenRoles.includes(userSiteRoleId))
      return this.router.createUrlTree([redirect]);

    // Has to be in the accepted roles.
    const acceptedRoles = route.data['acceptedRoles'] as Array<number> || [];
    if (acceptedRoles.length  && !acceptedRoles.includes(userSiteRoleId))
      return this.router.createUrlTree([redirect]);

    return true;
  }
}
