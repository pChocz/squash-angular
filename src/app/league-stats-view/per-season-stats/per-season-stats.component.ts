import { Component, OnInit, Input } from '@angular/core';
import { LeaguePerSeasonStatsDto } from '../model/league-per-season-stats-dto.model';

@Component({
  selector: 'app-per-season-stats',
  templateUrl: './per-season-stats.component.html',
  styleUrls: ['./per-season-stats.component.css']
})
export class PerSeasonStatsComponent implements OnInit {

  @Input() perSeasonStats: LeaguePerSeasonStatsDto[];

  displayedColumns: string[] = [
    'season-number-column',
    'rounds-column',
    'matches-column',
    'regularSets-column',
    'tieBreaks-column',
    'tieBreaksPercents-column',
    'points-column',
    'players-column',
    'allAttendices-column',
  ];

  constructor() {

  }

  ngOnInit(): void {
  }

}
