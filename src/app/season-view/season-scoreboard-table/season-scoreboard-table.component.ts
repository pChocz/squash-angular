import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { Subject } from 'rxjs';
import { SeasonScoreboard } from '../../shared/rest-api-dto/season-scoreboard.model';
import { MatTableDataSource } from '@angular/material/table';
import { SeasonScoreboardRow } from '../../shared/rest-api-dto/season-scoreboard-row.model';

@Component({
  selector: 'app-season-scoreboard-table',
  templateUrl: './season-scoreboard-table.component.html',
  styleUrls: ['./season-scoreboard-table.component.css']
})
export class SeasonScoreboardTableComponent implements OnInit {

  @Input() seasonScoreboard: SeasonScoreboard;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns: string[] = [
    'position',
    'player',
    'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9', 'r10',
    'totalPoints',
    'countedPoints',
    'attendices',
    'average',
    'bonusPoints',
    'countedPointsPretenders'
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
        return item.roundNumberToXpMapAll[roundNumber];
      } else {
        return item[property];
      }
    };
  }

}
