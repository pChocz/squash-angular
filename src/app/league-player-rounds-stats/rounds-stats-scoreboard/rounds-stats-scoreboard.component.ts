import {Component, Input, OnInit} from '@angular/core';
import {PlayerSingleRoundsStats} from "../../shared/rest-api-dto/player-single-rounds-stats.model";
import {Player} from "../../shared/rest-api-dto/player.model";
import {MatTableDataSource} from "@angular/material/table";

@Component({
    selector: 'app-rounds-stats-scoreboard',
    templateUrl: './rounds-stats-scoreboard.component.html',
    styleUrls: ['./rounds-stats-scoreboard.component.css']
})
export class RoundStatsScoreboardComponent implements OnInit {

    @Input() rows: PlayerSingleRoundsStats[];
    @Input() selectedPlayer: Player;

    dataSource: MatTableDataSource<PlayerSingleRoundsStats>;

    displayedColumns: string[] = [
        'number-column',
        'season-number-column',
        'round-date-column',
        'go-to-round-column',
        'round-number-column',
        'round-group-number-column',
        'round-split-column',
        'round-place-column',
        'round-group-place-column',
        'xp-earned-column',

        'matches-plus-column',
        'matches-minus-column',
        'matches-balance-column',
        'matches-percent-column',

        'sets-plus-column',
        'sets-minus-column',
        'sets-balance-column',
        'sets-percent-column',

        'points-plus-column',
        'points-minus-column',
        'points-balance-column',
        'points-percent-column',

        'opponents-column'
    ];

    constructor() {
    }

    ngOnInit(): void {
        this.dataSource = new MatTableDataSource(this.rows.slice().reverse());
    }

}
