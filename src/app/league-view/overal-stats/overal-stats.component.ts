import {Component, OnInit, Input} from '@angular/core';
import {LeagueOveralStats} from '../../shared/rest-api-dto/league-overal-stats.model';

export interface Stat {
    stat: string;
    value: number;
}

@Component({
    selector: 'app-overal-stats',
    templateUrl: './overal-stats.component.html',
    styleUrls: ['./overal-stats.component.css']
})
export class OveralStatsComponent implements OnInit {

    @Input() leagueOveralStats: LeagueOveralStats;

    stats: Stat[];

    displayedColumns: string[] = [
        'stat-column',
        'value-column'
    ];

    constructor() {

    }

    ngOnInit(): void {
        this.stats = [
            {stat: 'season.plural', value: this.leagueOveralStats.seasons},
            {stat: 'player.all', value: this.leagueOveralStats.players},
            {stat: 'player.average', value: this.leagueOveralStats.averagePlayersPerRound},
            {stat: 'round.plural', value: this.leagueOveralStats.rounds},
            {stat: 'match.plural', value: this.leagueOveralStats.matches},
            {stat: 'set.plural', value: this.leagueOveralStats.sets},
            {stat: 'rally.plural', value: this.leagueOveralStats.points}
        ];
    }

}
