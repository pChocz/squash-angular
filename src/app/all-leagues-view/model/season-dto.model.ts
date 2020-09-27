export class SeasonDto {

  public leagueId: number;
  public leagueName: string;

  public seasonId: number;
  public seasonUuid: string;
  public seasonNumber: number;
  public seasonNumberRoman: number;
  public seasonStartDate: Date;

  seasonStartDateFormatted(): string {
    return this.seasonStartDate.getDay + "." + this.seasonStartDate.getMonth + "." + this.seasonStartDate.getFullYear;
  }

}
