import {Component, Input, OnInit} from '@angular/core';
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
        'season-start-date-column',
        'regular-matches-column',
        'tiebreak-matches-column',
        'tiebreak-matches-percent-column',
        'points-column',
        'players-column',
        'players-average-per-round-column',
        'players-average-per-group-column',
        'groups-average-per-round-column',
        'button-column'
    ];

    constructor() {
    }

    ngOnInit(): void {
    }

}
