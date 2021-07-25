import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../auth.service';
import {TranslateService} from "@ngx-translate/core";

@Injectable()
export class AuthGuardLeaguePlayer implements CanActivate {

    constructor(private auth: AuthService,
                private router: Router,
                private snackBar: MatSnackBar,
                private translateService: TranslateService) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        let leagueUuid: string = route.queryParams.leagueUuid;
        if (!leagueUuid) {
            leagueUuid = route.params.uuid;
        }
        let hasToken = this.auth.hasAnyToken();
        if (hasToken) {
          return hasToken && new Promise((resolve) => {
            this.auth.hasRoleForLeague(leagueUuid, 'PLAYER').then((data) => {
              if (!data) {
                this.translateService
                .get('league.notPlayer')
                .subscribe((translation: string) => {
                  this.snackBar.open(translation, 'X', {
                    duration: 7 * 1000,
                    panelClass: ['mat-toolbar', 'mat-warn'],
                  });
                });
                this.router.navigate(['login'], {queryParams: {returnUrl: state.url}});
              }
              resolve(data);
            });
          });
        } else {
          this.router.navigate(['login'], {queryParams: {returnUrl: state.url}});
          return Promise.resolve(false);
        }
    }

}
