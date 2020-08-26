import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../_services';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
    const user = this.authenticationService.userValue;
    if (user){
      // authorized -> return true
      return true;
    }
    // user is not logged in -> redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url}});
    return false;
  }
}
