import {LeagueRole} from './league-role.model';
import {Type} from 'class-transformer';
import {League} from "./league.model";

export class PlayerDetailed {

  public enabled: boolean;
  public nonLocked: boolean;
  public registrationDateTime: Date;
  public lastLoggedInDateTime: Date;
  public successfulLoginAttempts: number;
  public wantsEmails: boolean;
  public locale: string;
  public id: number;
  public uuid: string;
  public username: string;
  public emoji: string;
  public email: string;

  public authorities: string[];

  @Type(() => LeagueRole)
  public leagueRoles: LeagueRole[];

  isAdmin(): boolean {
    return this.authorities.includes('ROLE_ADMIN');
  }

  isUser(): boolean {
    return this.authorities.includes('ROLE_USER');
  }

  hasRoleForLeague(leagueUuid: string | String, role: string): boolean {
    for (const leagueRole of this.leagueRoles) {
      if (leagueRole.leagueUuid === leagueUuid && leagueRole.leagueRole === role) {
        return true;
      }
    }
    return false;
  }

  hasAnyRoleForLeague(leagueUuid: string): boolean {
    for (const leagueRole of this.leagueRoles) {
      if (leagueRole.leagueUuid === leagueUuid) {
        return true;
      }
    }
    return false;
  }

  ownsLeague(leagueUuid: string | String): boolean {
    for (const leagueRole of this.leagueRoles) {
      if (leagueRole.leagueUuid === leagueUuid
          && leagueRole.leagueRole === 'OWNER') {
        return true;
      }
    }
    return false;
  }

  moderatesLeague(leagueUuid: string | String): boolean {
    for (const leagueRole of this.leagueRoles) {
      if (leagueRole.leagueUuid === leagueUuid
          && (leagueRole.leagueRole === 'OWNER' || leagueRole.leagueRole === 'MODERATOR')) {
        return true;
      }
    }
    return false;
  }

  moderatesLeagues(): League[] {
    let leagues: League[] = [];

    for (let role of this.leagueRoles) {
      if (role.leagueRole === 'MODERATOR' || role.leagueRole === 'OWNER') {
        let league = new League(role.leagueName, role.leagueUuid);
        if (leagues.findIndex(l => l.leagueUuid === league.leagueUuid) === -1) {
          leagues.push(league)
        }
      }
    }

    return leagues;
  }

  isPlayerForLeagues(): League[] {
    let leagues: League[] = [];

    for (let role of this.leagueRoles) {
      if (role.leagueRole === 'PLAYER') {
        leagues.push(new League(role.leagueName, role.leagueUuid))
      }
    }

    return leagues;
  }

}
