import {Injectable} from "@angular/core";
import {UrlBuilder} from "./url-builder";
import {QueryStringParameters} from "./query-string-parameters";
import {environment} from "../../environments/environment";

@Injectable()
export class ApiEndpointsService {

    constructor() {

    }

    public getLeagueUuidByRoundUuid(roundUuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables('rounds', [roundUuid, 'leagueUuid']);
    }

    public getSeasonScoreboardByUuid(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables('scoreboards/seasons', [uuid]);
    }

    public getRoundByUuid(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables('rounds', [uuid]);
    }

    public getMatchByUuid(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables('matches', [uuid]);
    }

    public getRoundScoreboardByUuid(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables('scoreboards/rounds', [uuid]);
    }

    public getPasswordReset(): string {
        return ApiEndpointsService.createUrl('players/resetPassword');
    }

    public getPlayerByPasswordResetToken(token: string): string {
        return ApiEndpointsService.createUrlWithPathVariables('token/passwordReset', [token]);
    }

    public getSeasons(): string {
        return ApiEndpointsService.createUrl('seasons');
    }

    public getRounds(): string {
        return ApiEndpointsService.createUrl('rounds');
    }

    public getSeasonPlayersSorted(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables('scoreboards/seasons', [uuid, 'players-sorted']);
    }

    public getAllXpPoints(): string {
        return ApiEndpointsService.createUrl('xpPoints/all-for-table');
    }

    public getLogout(): string {
        return ApiEndpointsService.createUrl('players/logout');
    }

    public getLogin(): string {
        return ApiEndpointsService.createUrl('login');
    }

    public getLeagueStatsByUuid(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables('leagues', [uuid, 'stats']);
    }

    public getPlayerRoundsStats(): string {
        return ApiEndpointsService.createUrl('players-scoreboards/rounds-stats');
    }

    public getMatchesForLeagueForPlayers(leagueUuid: string, selectedPlayersUuids: string[]): string {
        return ApiEndpointsService.createUrlWithPathVariables('matches/pageable/leagues',
            [
                leagueUuid,
                'players',
                selectedPlayersUuids
            ]
        );
    }

    public getSelectedPlayersScoreboardForLeague(leagueUuid: string, selectedPlayersUuids: string[]): string {
        return ApiEndpointsService.createUrlWithPathVariables('players-scoreboards/leagues',
            [
                leagueUuid,
                'players',
                selectedPlayersUuids
            ]
        );
    }

    public getLeaguePlayersByUuid(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables('leagues', [uuid, 'players-general']);
    }

    public getLeagueGeneralInfoByUuid(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables('leagues/general-info', [uuid]);
    }

    public getRequestPasswordReset(): string {
        return ApiEndpointsService.createUrl('players/requestPasswordReset');
    }

    public getMeAgainstAllScoreboardForLeague(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables('players-scoreboards/leagues', [uuid, 'me-against-all']);
    }

    public getHallOfFameForPlayer(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables('hall-of-fame', [uuid]);
    }

    public getMeAgainstAllScoreboard(): string {
        return ApiEndpointsService.createUrl('players-scoreboards/me-against-all');
    }

    public getMostRecentRoundForPlayer(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables('scoreboards/most-recent-round', [uuid]);
    }

    public getAboutMeInfo(): string {
        return ApiEndpointsService.createUrl('players/me');
    }

    public postConfirmRegistration(): string {
        return ApiEndpointsService.createUrl('players/confirmRegistration');
    }

    public getAllLeaguesGeneralInfo(): string {
        return ApiEndpointsService.createUrl('leagues/general-info');
    }

    public getAllLeaguesLogos(): string {
        return ApiEndpointsService.createUrl('leagues/all-logos');
    }

    public getPlayersBySeasonUuid(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables('seasons', [uuid, 'players']);
    }

    public getSeasonByUuid(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables('seasons', [uuid]);
    }

    public getBonusPointsBySeasonUuid(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables('bonusPoints/season', [uuid]);
    }

    public getBonusPointByUuid(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables('bonusPoints', [uuid]);
    }

    public getBonusPoints(): string {
        return ApiEndpointsService.createUrlWithPathVariables('bonusPoints');
    }

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
        // Push extra query string params
        if (queryStringHandler) {
            queryStringHandler(urlBuilder.queryString);
        }
        return urlBuilder.toString();
    }

    private static createUrlWithPathVariables(action: string,
                                              pathVariables: any[] = []): string {
        let encodedPathVariablesUrl: string = '';
        // Push extra path variables
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
