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

}
