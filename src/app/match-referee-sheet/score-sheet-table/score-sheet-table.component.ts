import {Component, Input, OnInit} from '@angular/core';
import {MatchScore} from "../../shared/rest-api-dto/match-score.model";

@Component({
    selector: 'app-score-sheet-table',
    templateUrl: './score-sheet-table.component.html',
    styleUrls: ['./score-sheet-table.component.css']
})
export class ScoreSheetTableComponent implements OnInit {

    headers: string[] = [
        'header-row-p1',
        'header-row-p2'
    ];

    displayedColumns: string[] = [
        'p1-serve',
        'p1-score',
        'p2-score',
        'p2-serve'
    ];

    @Input() matchScores: MatchScore[];
    @Input() gameNumber: number;

    matchScoresRallies: MatchScore[];

    constructor() {
    }

    ngOnInit(): void {
        this.matchScoresRallies = this.matchScores.filter(v => v.rally);
    }

    gameBeginsTime(): Date {
        let gameBegins = this.matchScores.filter(v => v.scoreEventType === 'GAME_BEGINS');
        return gameBegins.length === 0
            ? null
            : new Date(gameBegins[gameBegins.length - 1].dateTime);
    }

    gameEndsTime(): Date {
        let gameEnds = this.matchScores.filter(v => v.scoreEventType === 'GAME_ENDS');
        return gameEnds.length === 0
            ? null
            : new Date(gameEnds[gameEnds.length - 1].dateTime);
    }

    isGameFinished(): boolean {
        return this.gameBeginsTime() !== null
            && this.gameEndsTime() !== null;
    }

    calculateGameDuration(): number {
        return Math.abs(this.gameEndsTime().getTime() - this.gameBeginsTime().getTime());
    }
}
