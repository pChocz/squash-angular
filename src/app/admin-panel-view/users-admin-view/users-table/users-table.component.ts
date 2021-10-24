import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {PlayerDetailed} from "../../../shared/rest-api-dto/player-detailed.model";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.css']
})
export class UsersTableComponent implements OnInit {

  @Input() players: PlayerDetailed[];

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  dataSource: MatTableDataSource<PlayerDetailed>;

  displayedColumns: string[] = [
    'id',
    'emoji',
    'username',
    'email',
    'successfulLoginAttempts',
    'wantsEmails',
    'enabled',
    'nonLocked',
    'locale',
    'registrationDateTime',
    'lastLoggedInDateTime',
    'uuid',
    'edit-button-column',
  ];

  constructor() {
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.players);
    this.dataSource.sort = this.sort;

    this.dataSource.sortingDataAccessor = (item, property) => {
      return item[property];
    };

    this.dataSource.filterPredicate = (data: any, filterValue) => {
      const dataStr = JSON.stringify(data).toLowerCase();
      return dataStr.indexOf(filterValue) != -1;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
