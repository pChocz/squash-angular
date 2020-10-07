import { Type } from 'class-transformer';
import { Season } from './season.model';

export class League {
    public leagueId: number;
    public leagueUuid: string;
    public leagueName: string;
    public leagueLogo: string;

    @Type(() => Season)
    public seasons: Season[];

    public logoSanitized(): string {
        return 'data:Image/*;base64,' + this.leagueLogo;
    }
}
