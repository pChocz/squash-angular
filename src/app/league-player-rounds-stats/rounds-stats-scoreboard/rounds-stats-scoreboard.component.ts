import {Component, Input, OnInit} from '@angular/core';
import {PlayerSingleRoundsStats} from "../../shared/rest-api-dto/player-single-rounds-stats.model";
import {Player} from "../../shared/rest-api-dto/player.model";

@Component({
  selector: 'app-rounds-stats-scoreboard',
  templateUrl: './rounds-stats-scoreboard.component.html',
  styleUrls: ['./rounds-stats-scoreboard.component.css']
})
export class RoundStatsScoreboardComponent implements OnInit {

  @Input() rows: PlayerSingleRoundsStats[];
  @Input() selectedPlayer: Player;

  displayedColumns: string[] = [
    'season-number-column',
    'round-date-column',
    'round-number-column',
    'round-group-number-column',
    'round-split-column',
    'round-place-column',
    'round-group-place-column',
    'xp-earned-column',
    'matches-plus-column',
    'matches-minus-column',
    'matches-balance-column',
    'sets-plus-column',
    'sets-minus-column',
    'sets-balance-column',
    'points-plus-column',
    'points-minus-column',
    'points-balance-column',
    'opponents-column'
  ];

  constructor() {
  }

  ngOnInit(): void {
  }

}
