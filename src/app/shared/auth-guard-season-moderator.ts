import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardSeasonModerator implements CanActivate {

    constructor(
        public auth: AuthService,
        public router: Router,
        private snackBar: MatSnackBar) {

    }

    canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
        let seasonUuid: string = route.queryParams["seasonUuid"];
        return new Promise(resolve => {
            this.auth.hasRoleForLeagueForSeason(seasonUuid, "MODERATOR").then(data => {
                if (!data) {
                    this.snackBar.open("You are not a MODERATOR of this league!", "X", {
                        duration: 7 * 1000,
                        panelClass: ['mat-toolbar', 'mat-warn']
                      });
                }
                resolve(data);
            });
        });
    }

}