import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {SeasonScoreboard} from '../../shared/rest-api-dto/season-scoreboard.model';
import {MatTableDataSource} from '@angular/material/table';
import {SeasonScoreboardRow} from '../../shared/rest-api-dto/season-scoreboard-row.model';
import {SeasonStar} from "../../shared/rest-api-dto/season-star.model";

@Component({
  selector: 'app-season-scoreboard-table',
  templateUrl: './season-scoreboard-table.component.html',
  styleUrls: ['./season-scoreboard-table.component.css']
})
export class SeasonScoreboardTableComponent implements OnInit {

  @Input() seasonScoreboard: SeasonScoreboard;
  @Input() hideRounds: boolean;

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  displayedColumns: string[] = [
    'position',
    'emoji',
    'player',
    'star',
    'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9', 'r10', 'r11', 'r12', 'r13', 'r14', 'r15',
    'bonusPoints',
    'totalPoints',
    'countedPoints',
    'countedPointsPretenders',
    'attendices',
    'average'
  ];

  dataSource: MatTableDataSource<SeasonScoreboardRow>;

  constructor() {

  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.seasonScoreboard.seasonScoreboardRows);
    this.dataSource.sort = this.sort;

    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property.startsWith('r')) {
        let roundNumber: number = Number(property.substring(1));
        if (item.roundNumberToXpMapAll[roundNumber]) {
          return -item.roundNumberToXpMapAll[roundNumber].positionInRound;
        } else {
          return null;
        }
      } else {
        return item[property];
      }
    };
  }

  getStarForPlayer(playerUuid: string): SeasonStar {
    return this.seasonScoreboard.seasonStars[playerUuid];
  }
}
