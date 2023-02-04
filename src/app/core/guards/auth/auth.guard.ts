import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import AuthStoreService from '../../services/store/auth.store.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authStoreService: AuthStoreService,
  ) {
    //
  }

  /**
   * Protect routes by checking if the user is logged in or not.
   * Route datas :
   * - redirect => Where will the page be redirected. (default is root)
   * - authentified => Requires to be authentified (true), or not (false). (default is true)
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
    // requires to be authentified by default.
    const authentified = route.data['authentified'] ?? true;

    const user = this.authStoreService.user;

    if ((authentified && !user) || (!authentified && user))
      return this.router.createUrlTree([redirect]);

    return true;
  }
}
