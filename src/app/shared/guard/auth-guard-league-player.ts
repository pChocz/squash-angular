import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuardLeaguePlayer implements CanActivate {

    constructor(private auth: AuthService,
                private router: Router,
                private snackBar: MatSnackBar) {

    }

    canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
        let leagueUuid: string = route.queryParams.leagueUuid;
        if (!leagueUuid) {
            leagueUuid = route.params.uuid;
        }
        return this.auth.hasAnyToken() && new Promise((resolve) => {
            this.auth.hasRoleForLeague(leagueUuid, 'PLAYER').then((data) => {
                if (!data) {
                    this.snackBar.open('You are not a PLAYER of this league!', 'X', {
                        duration: 7 * 1000,
                        panelClass: ['mat-toolbar', 'mat-warn'],
                    });
                }
                resolve(data);
            });
        });
    }

}
