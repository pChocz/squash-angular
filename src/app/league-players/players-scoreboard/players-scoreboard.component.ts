import { Component, OnInit, Input } from '@angular/core';
import { RoundGroupScoreboardRow } from 'src/app/round-view/model/round-group-scoreboard-row.model';

@Component({
    selector: 'app-players-scoreboard',
    templateUrl: './players-scoreboard.component.html',
    styleUrls: ['./players-scoreboard.component.css'],
})
export class PlayersScoreboardComponent implements OnInit {
    @Input() roundGroupScoreboardRows: RoundGroupScoreboardRow[];

    displayedColumns: string[] = [
        'player-column',
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

    constructor() {}

    ngOnInit(): void {}
}
