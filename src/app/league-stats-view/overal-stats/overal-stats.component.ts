import { Component, OnInit, Input } from '@angular/core';
import { LeagueOveralStats } from '../../shared/rest-api-dto/league-overal-stats.model';
import {TranslateService} from "@ngx-translate/core";

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

  constructor(private translateService: TranslateService) {

  }

  ngOnInit(): void {

    this.translateService
        .get(['season.plural', 'player.all', 'player.average', 'round.plural', 'match.plural', 'set.plural', 'rally.plural'])
        .subscribe(data => {
          this.stats = [
            { stat: data['season.plural'], value: this.leagueOveralStats.seasons },
            { stat: data['player.all'], value: this.leagueOveralStats.players },
            { stat: data['player.average'], value: this.leagueOveralStats.averagePlayers },
            { stat: data['round.plural'], value: this.leagueOveralStats.rounds },
            { stat: data['match.plural'], value: this.leagueOveralStats.matches },
            { stat: data['set.plural'], value: this.leagueOveralStats.sets },
            { stat: data['rally.plural'], value: this.leagueOveralStats.points }
          ];
        });
  }

}
