import {Component, Input, OnInit} from '@angular/core';
import {LeagueScoreboardRow} from '../../shared/rest-api-dto/league-scoreboard-row.model';

@Component({
    selector: 'app-league-scoreboard',
    templateUrl: './league-scoreboard.component.html',
    styleUrls: ['./league-scoreboard.component.css']
})
export class LeagueScoreboardComponent implements OnInit {

    @Input() leagueScoreboardRows: LeagueScoreboardRow[];

    displayedColumns: string[] = [
        'position-column',
        'player-column-emoji',
        'player-column',
        'xp-total-column',
        'average-column',
        'attendices-column',
        'matches-plus-column',
        'matches-minus-column',
        'matches-balance-column',
        'sets-plus-column',
        'sets-minus-column',
        'sets-balance-column',
        'points-plus-column',
        'points-minus-column',
        'points-balance-column',
    ];

    constructor() {

    }

    ngOnInit(): void {

    }

}
