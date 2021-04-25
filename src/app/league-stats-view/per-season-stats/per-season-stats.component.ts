import {Component, OnInit, Input} from '@angular/core';
import {LeaguePerSeasonStats} from '../../shared/rest-api-dto/league-per-season-stats.model';

@Component({
    selector: 'app-per-season-stats',
    templateUrl: './per-season-stats.component.html',
    styleUrls: ['./per-season-stats.component.css']
})
export class PerSeasonStatsComponent implements OnInit {

    @Input() perSeasonStats: LeaguePerSeasonStats[];

    displayedColumns: string[] = [
        'season-number-column',
        'regular-matches-column',
        'tiebreak-matches-column',
        'tiebreak-matches-percent-column',
        'points-column',
        'players-column',
        'players-average-column',
        'button-column'
    ];

    constructor() {

    }

    ngOnInit(): void {
        console.log(this.perSeasonStats);
    }

}
