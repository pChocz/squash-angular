import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";

@Injectable()
export class AuthGuardAdmin implements CanActivate {

    constructor(private auth: AuthService,
                private router: Router,
                private snackBar: MatSnackBar,
                private translateService: TranslateService) {

    }

    canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
        return this.auth.hasAnyToken() && new Promise((resolve) => {
            this.auth.isAdmin().then((data) => {
                if (!data) {
                    this.translateService
                        .get('adminPanel.notAdmin')
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
