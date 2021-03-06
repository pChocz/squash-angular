import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {TranslateService} from "@ngx-translate/core";

@Injectable()
export class AuthGuardSeasonModerator implements CanActivate {

    constructor(private auth: AuthService,
                private router: Router,
                private snackBar: MatSnackBar,
                private translateService: TranslateService) {

    }

    canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
        const seasonUuid: string = route.queryParams.seasonUuid;
        return this.auth.hasAnyToken() && new Promise((resolve) => {
            this.auth.hasRoleForLeagueForSeason(seasonUuid, 'MODERATOR').then((data) => {
                if (!data) {
                    this.translateService
                        .get('league.notModerator')
                        .subscribe((translation: string) => {
                            this.snackBar.open(translation, 'X', {
                                duration: 7 * 1000,
                                panelClass: ['mat-toolbar', 'mat-warn'],
                            });
                        });
                }
                resolve(data);
            });
        });
    }

}
