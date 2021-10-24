import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {PlayerDetailed} from "../../../shared/rest-api-dto/player-detailed.model";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {ApiEndpointsService} from "../../../shared/api-endpoints.service";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {plainToClass} from "class-transformer";
import {MatSnackBar} from "@angular/material/snack-bar";

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
    'logout-button-column'
  ];

  constructor(private apiEndpointsService: ApiEndpointsService,
              private snackBar: MatSnackBar,
              private http: HttpClient) {
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

  toggleBooleanParam(player: PlayerDetailed, param: string): void {
    const value: boolean = player[param];

    this.http
    .put(this.apiEndpointsService.getPlayer(player.uuid),
        {},
        {
          params: {
            [param]: !value
          }
        }
    )
    .subscribe(
        () => {
          this.update();
        }
    );
  }

  update(): void {
    this.http
    .get<PlayerDetailed[]>(this.apiEndpointsService.getAllPlayers())
    .pipe(map((result) => plainToClass(PlayerDetailed, result)))
    .subscribe((result) => {
      this.players = result;
      this.dataSource = new MatTableDataSource(this.players);
      this.dataSource.sort = this.sort;
    });
  }

  logoutUser(player: PlayerDetailed): void {
    this.http
    .post(this.apiEndpointsService.getInvalidateTokensForPlayer(player.uuid),
        {},
        {}
    )
    .subscribe(
        () => {
          this.snackBar.open('User [' + player.username + '] has been logged out!', 'X', {
            duration: 5 * 1000,
            panelClass: ['mat-toolbar', 'mat-warn'],
          });
        }
    );
  }
}
