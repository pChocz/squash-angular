import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {SeasonScoreboard} from '../../shared/rest-api-dto/season-scoreboard.model';
import {MatTableDataSource} from '@angular/material/table';
import {SeasonScoreboardRow} from '../../shared/rest-api-dto/season-scoreboard-row.model';

@Component({
    selector: 'app-season-balances-table',
    templateUrl: './season-balances-table.component.html',
    styleUrls: ['./season-balances-table.component.css']
})
export class SeasonBalancesTableComponent implements OnInit {

    @Input() seasonScoreboard: SeasonScoreboard;

    @ViewChild(MatSort, {static: true}) sort: MatSort;

    displayedColumns: string[] = [
        'position-column',
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

    dataSource: MatTableDataSource<SeasonScoreboardRow>;

    constructor() {

    }

    ngOnInit(): void {
        this.dataSource = new MatTableDataSource(this.seasonScoreboard.seasonScoreboardRows);
        this.dataSource.sort = this.sort;
    }

}
