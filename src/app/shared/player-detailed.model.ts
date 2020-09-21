import { LeagueRole } from './league-role.model';
import { Type } from 'class-transformer';

export class PlayerDetailed {

    public id: number;
    public uuid: string;
    public username: string;
    public email: string;

    public authorities: string[];

    @Type(() => LeagueRole)
    public leagueRoles: LeagueRole[];

    isAdmin(): boolean {
        return this.authorities.includes("ROLE_ADMIN");
    }

    hasRoleForLeague(leagueUuid: string, role: string): boolean {
        for (let leagueRole of this.leagueRoles) {
            if (leagueRole.leagueUuid == leagueUuid && leagueRole.leagueRole == role) {
                return true;
            }
        }
        return false;
    }

}