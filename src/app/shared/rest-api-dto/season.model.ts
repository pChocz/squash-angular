export class Season {
    public leagueUuid: string;
    public leagueName: string;
    public description: string;

    public xpPointsType: string;
    public seasonUuid: string;
    public seasonNumber: number;
    public seasonNumberRoman: string;
    public seasonStartDate: Date;
    public allRounds: number;
    public countedRounds: number;
    public matchFormatType: string;
    public regularSetWinningType: string;
    public tiebreakWinningType: string;
    public regularSetWinningPoints: number;
    public tiebreakWinningPoints: number;
}
