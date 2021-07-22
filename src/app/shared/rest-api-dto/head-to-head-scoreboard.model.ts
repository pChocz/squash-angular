import {Type} from 'class-transformer';
import {Match} from "./match.model";
import {HeadToHeadScoreboardRow} from "./head-to-head-scoreboard-row.model";
import {HeadToHeadChartRow} from "./head-to-head-chart-row.model";

export class HeadToHeadScoreboard {

    @Type(() => HeadToHeadScoreboardRow)
    public winner: HeadToHeadScoreboardRow;

    @Type(() => HeadToHeadScoreboardRow)
    public looser: HeadToHeadScoreboardRow;

    @Type(() => Match)
    public matches: Match[];

    @Type(() => HeadToHeadChartRow)
    public chartRows: HeadToHeadChartRow[];

    public getNumberOfOneSetMatches(): number {
        return this.winner.oneSetMatchesWon + this.winner.oneSetMatchesLost;
    }

    public getNumberOfTwoSetsMatches(): number {
        return this.winner.twoSetsMatchesWon + this.winner.twoSetsMatchesLost;
    }

    public getNumberOfThreeSetsMatches(): number {
        return this.winner.threeSetsMatchesWon + this.winner.threeSetsMatchesLost;
    }

    public getNumberOfFourSetsMatches(): number {
        return this.winner.fourSetsMatchesWon + this.winner.fourSetsMatchesLost;
    }

    public getNumberOfFiveSetsMatches(): number {
        return this.winner.fiveSetsMatchesWon + this.winner.fiveSetsMatchesLost;
    }

    public getNumberOfFirstSets(): number {
        return this.winner.firstSetsWon + this.winner.firstSetsLost;
    }

    public getNumberOfSecondSets(): number {
        return this.winner.secondSetsWon + this.winner.secondSetsLost;
    }

    public getNumberOfThirdSets(): number {
        return this.winner.thirdSetsWon + this.winner.thirdSetsLost;
    }

    public getNumberOfFourthSets(): number {
        return this.winner.fourthSetsWon + this.winner.fourthSetsLost;
    }

    public getNumberOfFifthSets(): number {
        return this.winner.fifthSetsWon + this.winner.fifthSetsLost;
    }
}
