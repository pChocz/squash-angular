import { Component, OnInit, Input } from '@angular/core';
import { LeagueOveralStats } from '../../shared/rest-api-dto/league-overal-stats.model';

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
      { stat: "Seasons", value: this.leagueOveralStats.seasons },
      { stat: "All Players", value: this.leagueOveralStats.players },
      { stat: "Avg Players", value: this.leagueOveralStats.averagePlayers },
      { stat: "Rounds", value: this.leagueOveralStats.rounds },
      { stat: "Matches", value: this.leagueOveralStats.matches },
      { stat: "Sets", value: this.leagueOveralStats.sets },
      { stat: "Rallies", value: this.leagueOveralStats.points }
    ];
  }

}
