import {Type} from 'class-transformer';
import {LeagueSimple} from './league-simple.model';
import {MatchesGroupedPerPlayer} from './matches-grouped-per-player.model';

export class MatchesGroupedPerLeague {
    public matches: number;

    @Type(() => LeagueSimple)
    public league: LeagueSimple;

    @Type(() => MatchesGroupedPerPlayer)
    public perPlayer: MatchesGroupedPerPlayer[];
}
