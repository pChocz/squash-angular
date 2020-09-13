import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardLeague implements CanActivate {

    constructor(
        public auth: AuthService,
        public router: Router) {

    }

    canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
        console.log(route);
        let leagueUuid: string = route.params["uuid"];
        return this.auth.hasRoleForLeague(leagueUuid);
    }

}