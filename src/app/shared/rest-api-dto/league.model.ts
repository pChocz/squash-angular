import {Type} from 'class-transformer';
import {Season} from './season.model';
import {Player} from "./player.model";
import {Audit} from "./audit.model";

export class League {

    public leagueId: string;
    public leagueUuid: string;
    public leagueName: string;
    public leagueLogo: string;
    public dateOfCreation: Date;
    public matchFormatType: string;
    public location: string;
    public time: string;

    @Type(() => Season)
    public seasons: Season[];

    @Type(() => Player)
    public owners: Player[];

    @Type(() => Player)
    public moderators: Player[];

    @Type(() => Audit)
    public audit: Audit;

    constructor(leagueName: string, leagueUuid: string) {
        this.leagueName = leagueName;
        this.leagueUuid = leagueUuid;
    }

}
