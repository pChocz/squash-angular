export class Season {

  public leagueId: number;
  public leagueUuid: string;
  public leagueName: string;

  public seasonId: number;
  public seasonUuid: string;
  public seasonNumber: number;
  public seasonNumberRoman: string;
  public seasonStartDate: Date;

  seasonStartDateFormatted(): string {
    return this.seasonStartDate.getDay + "." + this.seasonStartDate.getMonth + "." + this.seasonStartDate.getFullYear;
  }

}
