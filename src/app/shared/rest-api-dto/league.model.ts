import {Type} from 'class-transformer';
import {Season} from './season.model';

export class League {

  public leagueId: string;
  public leagueUuid: string;
  public leagueName: string;
  public leagueLogo: string;
  public dateOfCreation: Date;
  public matchFormatType: string;
  @Type(() => Season)
  public seasons: Season[];

  constructor(leagueName: string, leagueUuid: string) {
    this.leagueName = leagueName;
    this.leagueUuid = leagueUuid;
  }

}
