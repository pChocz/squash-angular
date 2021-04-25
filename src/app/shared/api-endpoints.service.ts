import {Injectable} from "@angular/core";
import {UrlBuilder} from "./url-builder";
import {QueryStringParameters} from "./query-string-parameters";
import {environment} from "../../environments/environment";

@Injectable()
export class ApiEndpointsService {

    constructor() {
    }


    // -- Endpoints --

    // User access

    public getLogin(): string {
        return ApiEndpointsService.createUrl(
            'login'
        );
    }

    public getLogout(): string {
        return ApiEndpointsService.createUrl(
            'access/logout'
        );
    }

    public getPasswordReset(): string {
        return ApiEndpointsService.createUrl(
            'access/confirm-password-reset'
        );
    }

    public getPlayerByPasswordResetToken(token: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'access/reset-password-player',
            [token]
        );
    }

    public getRequestPasswordReset(): string {
        return ApiEndpointsService.createUrl(
            'access/request-password-reset'
        );
    }

    public getConfirmRegistration(): string {
        return ApiEndpointsService.createUrl(
            'access/confirm-registration'
        );
    }

    public getSignup(): string {
        return ApiEndpointsService.createUrl(
            'access/sign-up'
        );
    }

    public getRefreshToken(refreshToken: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'access/refresh-token',
            [refreshToken]
        );
    }

    public getChangeMyPassword(): string {
        return ApiEndpointsService.createUrl(
            'access/change-my-password',
        );
    }

    public getChangeMyEmail(): string {
        return ApiEndpointsService.createUrl(
            'access/change-my-email',
        );
    }

    public getJoinNewLeague(): string {
        return ApiEndpointsService.createUrl(
            'access/join-league',
        );
    }

    public getLeaveLeague(): string {
        return ApiEndpointsService.createUrl(
            'access/leave-league',
        );
    }


    // Players

    public getAllPlayers(): string {
        return ApiEndpointsService.createUrl(
            'players/all'
        );
    }

    public getAboutMeInfo(): string {
        return ApiEndpointsService.createUrl(
            'players/me'
        );
    }

    public getSelectedPlayersScoreboardForLeague(leagueUuid: string, selectedPlayersUuids: string[]): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'players-scoreboards',
            [leagueUuid, selectedPlayersUuids]
        );
    }

    public getPlayerRoundsStats(leagueUuid: string, playerUuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'rounds-stats',
            [leagueUuid, playerUuid]
        );
    }

    public getMeAgainstAllScoreboardForLeagueByUuid(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'players-scoreboards/me-against-all',
            [uuid]
        );
    }

    public getMeAgainstAllScoreboard(): string {
        return ApiEndpointsService.createUrl(
            'players-scoreboards/me-against-all'
        );
    }


    // Scoreboards

    public getSeasonScoreboardByUuid(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'scoreboards/seasons',
            [uuid]
        );
    }

    public getRoundScoreboardByUuid(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'scoreboards/rounds',
            [uuid]
        );
    }

    public getMostRecentRoundScoreboardForPlayerByUuid(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'scoreboards/most-recent-round-for-player',
            [uuid]
        );
    }


    // Leagues

    public getLeagueStatsByUuid(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'leagues/stats',
            [uuid]
        );
    }

    public getLeagueRulesByUuid(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'league-rules',
            [uuid]
        );
    }

    public getMostRecentRoundScoreboardForLeagueByUuid(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'scoreboards/most-recent-round-for-league',
            [uuid]
        );
    }

    public getCurrentSeasonScoreboardForLeagueByUuid(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'scoreboards/current-season-for-league',
            [uuid]
        );
    }

    public getLeaguePlayersByUuid(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'leagues/players',
            [uuid]
        );
    }

    public getLeagueGeneralInfoByUuid(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'leagues/general-info',
            [uuid]
        );
    }

    public getTrophiesByPlayerUuid(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'trophies',
            [uuid]
        );
    }

    public getAllLeaguesGeneralInfo(): string {
        return ApiEndpointsService.createUrl(
            'leagues/general-info'
        );
    }

    public getAllLeaguesLogos(): string {
        return ApiEndpointsService.createUrl(
            'leagues/all-logos'
        );
    }


    // Seasons

    public getSeasons(): string {
        return ApiEndpointsService.createUrl(
            'seasons'
        );
    }

    public getLeaguePlayersBySeasonUuidSorted(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'seasons/players-sorted',
            [uuid]
        );
    }

    public getPlayersBySeasonUuid(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'seasons/players',
            [uuid]
        );
    }

    public getSeasonByUuid(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'seasons',
            [uuid]
        );
    }


    // Rounds

    public getLeagueUuidByRoundUuid(roundUuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'rounds/league-uuid',
            [roundUuid]
        );
    }

    public getRoundByUuid(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'rounds',
            [uuid]
        );
    }

    public getRounds(): string {
        return ApiEndpointsService.createUrl(
            'rounds'
        );
    }

    public getRoundStateUpdate(uuid: string, state: boolean): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'rounds',
            [uuid, state]
        );
    }


    // Matches

    public getMatchByUuid(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'matches',
            [uuid]
        );
    }

    public getMatchesForLeagueForPlayers(leagueUuid: string, selectedPlayersUuids: string[]): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'matches/for-league-for-players',
            [leagueUuid, selectedPlayersUuids]
        );
    }


    // XP Points

    public getAllXpPoints(): string {
        return ApiEndpointsService.createUrl(
            'xp-points'
        );
    }

    public getAllXpPointsOfType(type: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'xp-points',
            [type]
        );
    }

    public getXpPointsTypes(): string {
        return ApiEndpointsService.createUrl(
            'xp-points/types'
        );
    }


    // Bonus Points

    public getBonusPointsBySeasonUuid(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'bonus-points/seasons',
            [uuid]
        );
    }

    public getBonusPointByUuid(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'bonus-points',
            [uuid]
        );
    }

    public getBonusPoints(): string {
        return ApiEndpointsService.createUrl(
            'bonus-points'
        );
    }


    // League logos

    public getLeagueLogoBySeasonUuid(seasonUuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'league-logos/season',
            [seasonUuid]
        );
    }

    public getLeagueLogoByRoundUuid(roundUuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'league-logos/round',
            [roundUuid]
        );
    }


    // Help methods

    private static createUrl(action: string): string {
        const urlBuilder: UrlBuilder = new UrlBuilder(
            environment.apiUrl,
            action
        );
        return urlBuilder.toString();
    }

    private static createUrlWithQueryParameters(action: string,
                                                queryStringHandler?: (queryStringParameters: QueryStringParameters) => void): string {
        const urlBuilder: UrlBuilder = new UrlBuilder(
            environment.apiUrl,
            action
        );
        if (queryStringHandler) {
            queryStringHandler(urlBuilder.queryString);
        }
        return urlBuilder.toString();
    }

    private static createUrlWithPathVariables(action: string,
                                              pathVariables: any[] = []): string {
        let encodedPathVariablesUrl: string = '';
        for (const pathVariable of pathVariables) {
            if (pathVariable !== null) {
                encodedPathVariablesUrl +=
                    `/${encodeURIComponent(pathVariable.toString())}`;
            }
        }
        const urlBuilder: UrlBuilder = new UrlBuilder(
            environment.apiUrl,
            `${action}${encodedPathVariablesUrl}`
        );
        return urlBuilder.toString();
    }

}
