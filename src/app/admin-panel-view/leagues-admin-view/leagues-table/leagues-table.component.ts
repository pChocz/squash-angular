import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {League} from "../../../shared/rest-api-dto/league.model";
import {HttpClient} from "@angular/common/http";
import {ApiEndpointsService} from "../../../shared/api-endpoints.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmationDialogComponent} from "../../../confirmation-dialog/confirmation-dialog.component";
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-leagues-table',
  templateUrl: './leagues-table.component.html',
  styleUrls: ['./leagues-table.component.css']
})
export class LeaguesTableComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  @Input() leagues: League[];
  @Input() logosMap: Map<string, string>;

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  dataSource: MatTableDataSource<League>;

  displayedColumns: string[] = [
    'number-column',
    'league-name-column',
    'seasons-column',
    'league-logo-column',
    'uuid-column',
    'edit-button-column',
    'delete-button-column',
  ];

  constructor(private http: HttpClient,
              private apiEndpointsService: ApiEndpointsService,
              private snackBar: MatSnackBar,
              private dialog: MatDialog,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.leagues);
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteLeague(league: League) {

    const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {message: 'adminPanel.league.delete.areYouSure', isRemoval: true},
        autoFocus: false
    });

    confirmationDialogRef.afterClosed()
    .subscribe(
        result => {
          if (result === true) {

            this.translateService
            .get('adminPanel.league.delete.deleting')
            .subscribe((translation: string) => {
              this.blockUI.start(translation);
            });

            this.http
            .delete<string>(this.apiEndpointsService.getLeagueWithUuid(league.leagueUuid))
            .subscribe(
                () => {
                  const index = this.dataSource.data.indexOf(league);
                  this.dataSource.data.splice(index, 1);
                  this.dataSource._updateChangeSubscription();

                  this.snackBar.open("League " + league.leagueName + " deleted!", 'X', {
                    duration: 7 * 1000,
                    panelClass: ['mat-toolbar', 'mat-primary'],
                  });
                  this.blockUI.stop();

                }, error => {
                  this.snackBar.open("ERROR", 'X', {
                    duration: 7 * 1000,
                    panelClass: ['mat-toolbar', 'mat-warn'],
                  });
                  this.blockUI.stop();
                });
          }
        });


  }

}
