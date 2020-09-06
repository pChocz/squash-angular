import { Component, OnInit, Input } from '@angular/core';
import { LeagueOveralStatsDto } from '../model/league-overal-stats-dto.model';

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

  @Input() leagueOveralStats: LeagueOveralStatsDto;

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
      { stat: "Points", value: this.leagueOveralStats.points }
    ];
  }

}
