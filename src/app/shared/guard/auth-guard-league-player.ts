import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../auth.service';
import {AuthGuardValidTokens} from "./auth-guard-valid-tokens";
import {TokenDecodeService} from "../token-decode.service";
import {GuardHelper} from "./guard-helper";

@Injectable()
export class AuthGuardLeaguePlayer extends AuthGuardValidTokens implements CanActivate {

    constructor(public auth: AuthService,
                public router: Router,
                public tokenDecodeService: TokenDecodeService) {
        super(auth, router, tokenDecodeService);
    }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        const leagueUuid: string = GuardHelper.extractLeagueUuidFromRoute(route);
        return await super.canActivate(route, state) && this.auth.isPlayerOfLeague(leagueUuid);
    }

}
