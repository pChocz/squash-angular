import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuardRoundModerator implements CanActivate {
    constructor(private auth: AuthService, private router: Router, private snackBar: MatSnackBar) {}

    canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
        const roundUuid: string = route.params.uuid;
        return new Promise((resolve) => {
            this.auth.hasRoleForLeagueForRound(roundUuid, 'MODERATOR').then((data) => {
                if (!data) {
                    this.snackBar.open('You are not a MODERATOR of this league!', 'X', {
                        duration: 7 * 1000,
                        panelClass: ['mat-toolbar', 'mat-warn'],
                    });
                }
                resolve(data);
            });
        });
    }
}