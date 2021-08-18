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


  // Players

  public getCheckUsernameOrEmailTaken(value: string): string {
    return ApiEndpointsService.createUrlWithPathVariables(
        'players/name-taken',
        [value]
    );
  }

  public getChangeMyEmail(): string {
    return ApiEndpointsService.createUrl(
        'access/change-my-email',
    );
  }

  public getLeagueRoles(leagueUuid, playerUuid, role): string {
    return ApiEndpointsService.createUrlWithPathVariables(
        'league-roles',
        [leagueUuid, playerUuid, role]
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


  // Scoreboards

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

  public getSeasonTrophiesForLeagueByUuid(uuid: string): string {
    return ApiEndpointsService.createUrlWithPathVariables(
        'trophies/league',
        [uuid]
    );
  }

  public getLeagueOveralStatsByUuid(uuid: string): string {
    return ApiEndpointsService.createUrlWithPathVariables(
        'leagues/overal-stats',
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

  public getLeaguePlayersDetailedByUuid(uuid: string): string {
    return ApiEndpointsService.createUrlWithPathVariables(
        'leagues/players-detailed',
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


  // App stats

  public getPlayersLogStats(file: string): string {
    return ApiEndpointsService.createUrlWithPathVariables(
        'app-stats/daily-players-queries-stats',
        [file]
    );
  }

  public getLogFilesDates(): string {
    return ApiEndpointsService.createUrl(
        'app-stats/log-files-dates'
    );
  }
}
