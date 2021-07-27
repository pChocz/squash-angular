import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../auth.service';
import {Globals} from "../../globals";

@Injectable()
export class AuthGuardAdmin implements CanActivate {

  constructor(private auth: AuthService,
              private router: Router) {

  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    let hasToken = this.auth.hasJwtToken();
    let hasRefreshToken = this.auth.hasRefreshToken();

    if (!hasToken) {
      await this.router.navigate([`/login`], {queryParams: {returnUrl: state.url}});
      return Promise.resolve(false);
    }

    let isTokenValid = this.auth.hasValidToken();
    if (!isTokenValid) {
      if (hasRefreshToken) {
        let currentRefreshToken: string = localStorage.getItem(Globals.STORAGE_REFRESH_TOKEN_KEY);
        await this.auth.refreshTokenPromise(currentRefreshToken);

      } else
        return Promise.resolve(false);
    }

    return await this.auth.isAdmin();
  }

}
