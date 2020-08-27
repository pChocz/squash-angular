import { Type } from 'class-transformer';

export class SeasonDto {

  public leagueId: number;
  public leagueName: string;

  public seasonId: number;
  public seasonUuid: string;
  public seasonNumber: number;
  public seasonStartDate: Date;

}
