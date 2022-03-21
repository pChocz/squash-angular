import {Component, Input, OnInit} from '@angular/core';
import {Player} from "../../shared/rest-api-dto/player.model";
import {MatTableDataSource} from "@angular/material/table";
import {PlayerSingleSeasonStats} from "../../shared/rest-api-dto/player-single-season-stats.model";
import {SeasonScoreboardRow} from "../../shared/rest-api-dto/season-scoreboard-row.model";

@Component({
  selector: 'app-seasons-stats-scoreboard',
  templateUrl: './seasons-stats-scoreboard.component.html',
  styleUrls: ['./seasons-stats-scoreboard.component.css']
})
export class SeasonsStatsScoreboardComponent implements OnInit {

  @Input() rows: PlayerSingleSeasonStats[];
  @Input() selectedPlayer: Player;

  dataSource: MatTableDataSource<PlayerSingleSeasonStats>;

  displayedColumns: string[] = [
    'season-number-column',
    'season-date-column',
    'season-description-column',

    'place-in-season-column',
    'attendices-column',
    'uber-stars-column',
    'promotions-column',
    'relegations-column',

    'xp-counted-column',
    'xp-total-column',
    'xp-pretenders-column',
    'xp-average-column',

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

  constructor() {
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.rows.slice().reverse());
  }

  countUberStars(stats: PlayerSingleSeasonStats): number | string {
    let count = 0;
    for (let p in stats.seasonScoreboardRow.roundNumberToXpMapAll) {
      let el = stats.seasonScoreboardRow.roundNumberToXpMapAll[p];
      if (el.positionInRound === 1) {
        count++;
      }
    }
    return count > 0 ? count : '';
  }

  countPromotions(stats: PlayerSingleSeasonStats): number | string {
    let count = 0;
    for (let p in stats.seasonScoreboardRow.roundNumberToXpMapAll) {
      let el = stats.seasonScoreboardRow.roundNumberToXpMapAll[p];
      if (el.positionInRound !== 1 && el.positionInGroup === 1) {
        count++;
      }
    }
    return count > 0 ? count : '';
  }

  countRelegations(stats: PlayerSingleSeasonStats): number | string {
    let count = 0;
    for (let p in stats.seasonScoreboardRow.roundNumberToXpMapAll) {
      let el = stats.seasonScoreboardRow.roundNumberToXpMapAll[p];
      if (el.lastPlaceInGroup) {
        count++;
      }
    }
    return count > 0 ? count : '';
  }
}
