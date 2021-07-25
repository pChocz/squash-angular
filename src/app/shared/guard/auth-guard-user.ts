import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../auth.service';

@Injectable()
export class AuthGuardUser implements CanActivate {

  constructor(
      private auth: AuthService,
      private router: Router) {

  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    let hasToken: boolean = this.auth.hasAnyToken();
    if (hasToken) {
      let isUser: boolean = await this.auth.isUser();
      if (isUser) {
        return Promise.resolve(true);
      }
    }
    // not logged in so redirect to login page with the return url and return false
    await this.router.navigate(['login'], {queryParams: {returnUrl: state.url}});
    return Promise.resolve(false);
  }

}
