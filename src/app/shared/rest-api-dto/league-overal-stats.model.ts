export class LeagueOveralStats {
    public leagueName: string;
    public leagueUuid: string;
    public time: string;
    public location: string;
    public seasons: number;
    public players: number;
    public averagePlayersPerRound: number;
    public averagePlayersPerGroup: number;
    public averageGroupsPerRound: number;
    public rounds: number;
    public matches: number;
    public sets: number;
    public points: number;
    public matchFormatType: string;
    public regularSetWinningType: string;
    public tiebreakWinningType: string;
    public regularSetWinningPoints: number;
    public tiebreakWinningPoints: number;
    public numberOfRoundsPerSeason: number;
    public roundsToBeDeducted: number;
    public dateOfCreation: Date;
}
