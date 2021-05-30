import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {PlayerLogStats} from "../../shared/rest-api-dto/player-log-stats.model";

@Component({
  selector: 'app-app-stats-summary-table',
  templateUrl: './app-stats-summary-table.component.html',
  styleUrls: ['./app-stats-summary-table.component.css']
})
export class AppStatsSummaryTableComponent implements OnInit {

  @Input() stats: PlayerLogStats[];

  dataSource: MatTableDataSource<PlayerLogStats>;

  displayedColumns: string[] = [
    'player-column',
    'number-of-queries-column',
    'number-of-requests-column',
    'number-of-database-queries-column',
    'total-time-millis-column',
  ];

  constructor() {
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.stats);
    console.log(this.stats);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.dataSource = new MatTableDataSource(changes.stats.currentValue);
  }


}
