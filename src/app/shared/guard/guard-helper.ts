import {ActivatedRouteSnapshot} from '@angular/router';

export abstract class GuardHelper {

    static extractLeagueUuidFromRoute(route: ActivatedRouteSnapshot) {
        let uuid = route.queryParams.leagueUuid;
        if (!uuid) {
            uuid = route.params.leagueUuid;
        }
        if (!uuid) {
            uuid = route.params.uuid;
        }
        return uuid;
    }

    static extractRoundUuidFromRoute(route: ActivatedRouteSnapshot) {
        let uuid = route.queryParams.roundUuid;
        if (!uuid) {
            uuid = route.params.roundUuid;
        }
        if (!uuid) {
            uuid = route.params.uuid;
        }
        return uuid;
    }

    static extractSeasonUuidFromRoute(route: ActivatedRouteSnapshot) {
        let uuid = route.queryParams.seasonUuid;
        if (!uuid) {
            uuid = route.params.seasonUuid;
        }
        if (!uuid) {
            uuid = route.params.uuid;
        }
        return uuid;
    }

}
