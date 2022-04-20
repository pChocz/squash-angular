import {Component, Input, OnInit} from '@angular/core';
import {RoundGroupScoreboardRow} from 'src/app/shared/rest-api-dto/round-group-scoreboard-row.model';
import {Globals} from "../../globals";

@Component({
    selector: 'app-players-scoreboard',
    templateUrl: './players-scoreboard.component.html',
    styleUrls: ['./players-scoreboard.component.css'],
})
export class PlayersScoreboardComponent implements OnInit {

    currentPlayerUuid: string;

    @Input() roundGroupScoreboardRows: RoundGroupScoreboardRow[];

    displayedColumns: string[] = [
        'player-emoji-column',
        'player-column',
        'head-to-head-column',
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
        const token: string = localStorage.getItem(Globals.STORAGE_JWT_TOKEN_KEY);
        if (token) {
            this.currentPlayerUuid = JSON.parse(atob(token.split('.')[1]))['uid'];
        }
    }

    ngOnInit(): void {
    }

    isUser() {

    }

}
