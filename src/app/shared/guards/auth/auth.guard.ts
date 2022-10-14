import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../data-access/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const redirect = route.data['redirect'] as string || '';
    // requires to be authentified by default.
    const authentified = route.data['authentified'] ?? true;

    const isAuthenticated = this.authService.isAuthenticated();

    if (
      (authentified && !isAuthenticated) ||
      (!authentified && isAuthenticated)
    ) 
      return this.router.createUrlTree([redirect]);

    return true;
  }
}
