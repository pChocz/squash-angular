import { LeagueRole } from './league-role.model';
import { Type } from 'class-transformer';

export class PlayerDetailed {
    public uuid: string;
    public username: string;
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

}
