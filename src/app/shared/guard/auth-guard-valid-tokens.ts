import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../auth.service';
import {Globals} from "../../globals";
import {TokenDecodeService} from "../token-decode.service";

@Injectable()
export class AuthGuardValidTokens implements CanActivate {

  constructor(public auth: AuthService,
              public router: Router,
              public tokenDecodeService: TokenDecodeService) {

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
        await this.auth.refreshTokenPromise(currentRefreshToken).finally(() => this.tokenDecodeService.refresh());

      } else {
        return Promise.resolve(false);
      }
    }

    return Promise.resolve(true);
  }

}
