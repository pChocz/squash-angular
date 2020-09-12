import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Subscription } from 'rxjs';

@Injectable()
export class AuthGuardAdmin implements CanActivate {

    testSubscription: Subscription;

    constructor(
        public auth: AuthService,
        public router: Router) {

    }

    canActivate(): Promise<boolean> {
        return this.auth.isAdmin();
    }

}