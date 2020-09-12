import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Subscription } from 'rxjs';

@Injectable()
export class AuthGuardLeague implements CanActivate {

    testSubscription: Subscription;

    constructor(
        public auth: AuthService,
        public router: Router) {

    }

    canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
        let leagueUuid: string = route.params["uuid"];
        return this.auth.hasRoleForLeague(leagueUuid);
    }

}