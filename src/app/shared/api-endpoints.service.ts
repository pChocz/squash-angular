import {Injectable} from "@angular/core";
import {UrlBuilder} from "./url-builder";
import {QueryStringParameters} from "./query-string-parameters";
import {environment} from "../../environments/environment";

@Injectable()
export class ApiEndpointsService {

    constructor() {

    }

    private static createUrl(action: string): string {
        const urlBuilder: UrlBuilder = new UrlBuilder(
            environment.apiUrl,
            action
        );
        return urlBuilder.toString();
    }

    private static createUrlWithPathVariablesAndQueryParameters(
        action: string,
        pathVariables: any[] = [],
        queryStringHandler?: (queryStringParameters: QueryStringParameters) => void): string {
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
        if (queryStringHandler) {
            queryStringHandler(urlBuilder.queryString);
        }
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


    // -- Endpoints --

    // Logs

    public getLog(): string {
        return ApiEndpointsService.createUrl(
            'frontend-logs'
        );
    }

    // User access

    public getSubmitContactForm(): string {
        return ApiEndpointsService.createUrl(
            'contact-form/send'
        );
    }

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

    public getRequestEmailChange(): string {
        return ApiEndpointsService.createUrl(
            'access/request-email-change'
        );
    }

    public getConfirmEmailChange(): string {
        return ApiEndpointsService.createUrl(
            'access/confirm-email-change'
        );
    }

    public getLoginWithMagicLink(): string {
        return ApiEndpointsService.createUrl(
            'access/login-with-magic-link'
        );
    }

    public getPlayerByPasswordResetToken(token: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'access/reset-password-player',
            [token]
        );
    }

    public getRequestMagicLoginLink(): string {
        return ApiEndpointsService.createUrl(
            'access/request-magic-login-link'
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

    public getInvalidateTokensForPlayer(playerUuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'access/invalidate-tokens-for-player',
            [playerUuid]
        );
    }

    public getLoginAsUser(): string {
        return ApiEndpointsService.createUrl(
            'access/admin-login-as-user'
        );
    }

    // Players

    public getCheckPasswordStrength(): string {
        return ApiEndpointsService.createUrl(
            'access/check-password-strength'
        );
    }

    public getCheckUsernameOrEmailTaken(value: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'players/name-taken',
            [value]
        );
    }

    public getCheckEmailValid(value: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'players/email-valid',
            [value]
        );
    }

    public getLeagueRolesByUuid(leagueUuid, playerUuid, role): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'league-roles/by-uuid',
            [leagueUuid, playerUuid, role]
        );
    }

    public getLeagueRolesByUsername(leagueUuid, playerUsername, role): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'league-roles/by-username',
            [leagueUuid, playerUsername, role]
        );
    }

    public getJoinLeagueRoles(leagueUuid): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'league-roles/join',
            [leagueUuid]
        );
    }

    public getLeaveLeagueRoles(leagueUuid): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'league-roles/leave',
            [leagueUuid]
        );
    }

    public getAllPlayers(): string {
        return ApiEndpointsService.createUrl(
            'players/all'
        );
    }

    public getEmoji(): string {
        return ApiEndpointsService.createUrl(
            'players/emoji'
        );
    }

    public getEmojiForPlayer(playerUuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'players/emoji',
            [playerUuid]
        );
    }

    public getAllPlayersGeneral(): string {
        return ApiEndpointsService.createUrl(
            'players/all-general'
        );
    }

    public getAboutMeInfo(): string {
        return ApiEndpointsService.createUrl(
            'players/me'
        );
    }

    public getMyLeagues(): string {
        return ApiEndpointsService.createUrl(
            'players/my-leagues'
        );
    }

    public getSelectedPlayersScoreboardForLeague(leagueUuid: string, selectedPlayersUuids: string[]): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'players-scoreboards',
            [leagueUuid, selectedPlayersUuids]
        );
    }

    public getHeadToHead(firstPlayerUuid: string, secondPlayerUuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'head-to-head',
            [firstPlayerUuid, secondPlayerUuid]
        );
    }

    public getPlayer(playerUuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'players',
            [playerUuid]
        );
    }


    // Scoreboards

    public getPlayerRoundsStats(leagueUuid: string, playerUuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'rounds-stats',
            [leagueUuid, playerUuid]
        );
    }

    public getPlayerSeasonsStats(leagueUuid: string, playerUuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'seasons-stats',
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

    // Match score sheet

    public getMatchScore(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'match-score',
            [uuid]
        );
    }

    public getMatchScoreLast(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'match-score/last',
            [uuid]
        );
    }

    public getMatchScoreAll(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'match-score/all',
            [uuid]
        );
    }

    // Leagues

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

    public getAdjacentRounds(roundUuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'rounds/adjacent',
            [roundUuid]
        );
    }


    public getAdjacentSeasons(seasonUuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'seasons/adjacent',
            [seasonUuid]
        );
    }

    public getMostRecentRoundScoreboardForPlayerByUuid(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'scoreboards/most-recent-round-for-player',
            [uuid]
        );
    }

    public getLeagueStatsByUuid(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'leagues/stats',
            [uuid]
        );
    }

    public getTrophies(): string {
        return ApiEndpointsService.createUrl(
            'trophies'
        );
    }

    public getSeasonTrophiesForLeagueByUuid(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'trophies/league',
            [uuid]
        );
    }

    public getSeasonTrophiesForLeagueByUuidAndSeasonNumber(uuid: string, seasonNumber: number): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'trophies/league',
            [uuid, seasonNumber]
        );
    }

    public getLeagueOveralStatsByUuid(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'leagues/overal-stats',
            [uuid]
        );
    }

    public getLeagueRulesForLeague(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'league-rules/for-league',
            [uuid]
        );
    }

    public getAddOrReplaceFootageForMatch(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'matches/add-or-replace-footage',
            [uuid]
        );
    }

    public getAddOrReplaceFootageForAdditionalMatch(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'additional-matches/add-or-replace-footage',
            [uuid]
        );
    }

    public getMatchesWithFootageForLeague(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'matches/with-footage',
            [uuid]
        );
    }

    public getLeagueRule(): string {
        return ApiEndpointsService.createUrl(
            'league-rules'
        );
    }

    public getLeagueRuleByUuid(uuid: string): string {
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

    public getCurrentSeasonScoreboardForPlayerByUuid(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'scoreboards/current-season-for-player',
            [uuid]
        );
    }

    public getLeaguePlayersByUuid(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'leagues/players',
            [uuid]
        );
    }

    public getLeagueModifyAsOwner(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'leagues/owner',
            [uuid]
        );
    }

    public getLeagueModifyAsModerator(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'leagues/moderator',
            [uuid]
        );
    }

    public getLeaguePlayersForLeagueModeratorByUuid(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'leagues/players-for-league-moderator',
            [uuid]
        );
    }

    public getLeagueGeneralInfoByUuid(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'leagues/general-info',
            [uuid]
        );
    }

    public getLeagueMatchResultsDistribution(uuid: string, includeAdditional: boolean, seasonNumbers?: number[]): string {
        if (seasonNumbers === undefined || seasonNumbers.length === 0) {
            return ApiEndpointsService.createUrlWithPathVariablesAndQueryParameters(
                'match-results-distribution',
                [uuid],
                qs => qs.push('includeAdditional', includeAdditional)
            );
        } else {
            return ApiEndpointsService.createUrlWithPathVariablesAndQueryParameters(
                'match-results-distribution',
                [uuid],
                qs => {
                    qs.push('includeAdditional', includeAdditional);
                    qs.push('seasonNumbers', seasonNumbers);
                }
            );
        }
    }

    public getLeagueSetResultsHistogram(uuid: string, includeAdditional: boolean, seasonNumbers?: number[]): string {
        if (seasonNumbers === undefined || seasonNumbers.length === 0) {
                return ApiEndpointsService.createUrlWithPathVariablesAndQueryParameters(
                    'set-results-histogram',
                    [uuid],
                    qs => (qs.push('includeAdditional', includeAdditional))
                );
        } else {
           return ApiEndpointsService.createUrlWithPathVariablesAndQueryParameters(
               'set-results-histogram',
               [uuid],
                qs => {
                    qs.push('seasonNumbers', seasonNumbers);
                    qs.push('includeAdditional', includeAdditional);
                }
           );
        }
    }

    public getTrophiesByPlayerUuid(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'trophies',
            [uuid]
        );
    }

    public getCheckLeagueNameTaken(leagueName: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'leagues/name-taken',
            [leagueName]
        );
    }

    public getLeague(): string {
        return ApiEndpointsService.createUrl(
            'leagues'
        );
    }

    public getLeagueWithUuid(leagueUuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'leagues',
            [leagueUuid]
        );
    }

    // Seasons

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

    public getAllAdditionalMatchesForLeague(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'additional-matches/all-for-league',
            [uuid]
        );
    }

    public getSeasons(): string {
        return ApiEndpointsService.createUrl(
            'seasons'
        );
    }


    // Rounds

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

    public getSeasonSplitsByUuid(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'seasons/splits',
            [uuid]
        );
    }

    public getLeagueUuidByRoundUuid(roundUuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'rounds/league-uuid',
            [roundUuid]
        );
    }


    // Matches

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

    public getRoundsWithUuid(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'rounds',
            [uuid]
        );
    }

    public getRoundStateUpdate(uuid: string, state: boolean): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'rounds',
            [uuid, state]
        );
    }

    public getMatchByUuid(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'matches',
            [uuid]
        );
    }

    public getAdditionalMatchByUuid(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'additional-matches',
            [uuid]
        );
    }


    // XP Points

    public getMatchesForLeagueForPlayers(leagueUuid: string, selectedPlayersUuids: string[]): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'matches/for-league-for-players',
            [leagueUuid, selectedPlayersUuids]
        );
    }

    public getMatchesAdditionalForLeagueForPlayers(leagueUuid: string, selectedPlayersUuids: string[]): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'matches/for-league-for-players-additional',
            [leagueUuid, selectedPlayersUuids]
        );
    }

    public getAdditionalMatches(): string {
        return ApiEndpointsService.createUrl(
            'additional-matches'
        );
    }


    // Bonus Points

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


    // League logos

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

    public getLostBallsBySeasonUuid(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'lost-balls/seasons',
            [uuid]
        );
    }

    public getLostBallByUuid(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'lost-balls',
            [uuid]
        );
    }

    public getLostBalls(): string {
        return ApiEndpointsService.createUrl(
            'lost-balls'
        );
    }


    // Help methods

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

    public getLeagueLogo(leagueUuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables(
            'league-logos',
            [leagueUuid]
        );
    }

    // Mongo Logs

    public getLogSummary(): string {
        return ApiEndpointsService.createUrl(
            'logs/summary'
        );
    }

    public getLogsPaginated(): string {
        return ApiEndpointsService.createUrl(
            'logs'
        );
    }

    // Cache

    public evictCacheAll(): string {
        return ApiEndpointsService.createUrl(
            'redis-cache/all'
        );
    }

}
