import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatSort} from "@angular/material/sort";
import {PlayerDetailed} from "../../../shared/rest-api-dto/player-detailed.model";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-players-table',
  templateUrl: './players-table.component.html',
  styleUrls: ['./players-table.component.css']
})
export class PlayersTableComponent implements OnInit {

  @Input() players: PlayerDetailed[];

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  dataSource: MatTableDataSource<PlayerDetailed>;

  displayedColumns: string[] = [
    'number-column',
    'username-column',
    'email-column',
    'authorities-column',
    'leagues-player-column',
    'leagues-moderator-column',
    'uuid-column',
    'edit-button-column',
  ];

  constructor() {
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.players);
    this.dataSource.filterPredicate = (data: any, filterValue) => {
      const dataStr = JSON.stringify(data).toLowerCase();
      return dataStr.indexOf(filterValue) != -1;
    }
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
