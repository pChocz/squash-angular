import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SeasonScoreboardRow } from './model/season-scoreboard-row.model';
import { Season } from './model/season.model';

const ROWS: SeasonScoreboardRow[] = [
  { player: "Adam S", r1: 85, r2: 100, r3: 120, r4: null, r5: null, r6: null, r7: null, r8: null, r9: null, r10: null, totalPoints: 305, countedPoints: 305, attendices: 3, average: 101, bonusPoints: null, pretendersCountedPoints: null },
  { player: "Kaczor", r1: 70, r2: 70, r3: 70, r4: null, r5: null, r6: null, r7: null, r8: null, r9: null, r10: null, totalPoints: 210, countedPoints: 210, attendices: 3, average: 70, bonusPoints: null, pretendersCountedPoints: null },
  { player: "Maniak", r1: null, r2: 40, r3: 100, r4: null, r5: null, r6: null, r7: null, r8: null, r9: null, r10: null, totalPoints: 141, countedPoints: 141, attendices: 2, average: 70, bonusPoints: 1, pretendersCountedPoints: 40 },
];

@Component({
  selector: 'app-season-view',
  templateUrl: './season-view.component.html',
  styleUrls: ['./season-view.component.css']
})
export class SeasonViewComponent implements OnInit {

  displayedColumns: string[] = ['player', 'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9', 'r10', 'totalPoints', 'countedPoints', 'attendices', 'average', 'bonusPoints', 'pretendersCountedPoints'];
  dataSource = new MatTableDataSource(ROWS);
  uid: number;
  season: Season;

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => this.uid = params["uid"]);
    console.log(this.uid)
  }

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit(): void {
    this.sort.sort(({ id: 'countedPoints', start: 'desc' }) as MatSortable);
    this.dataSource.sort = this.sort;
  }

}
