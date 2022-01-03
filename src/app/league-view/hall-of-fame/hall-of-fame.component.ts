import {Component, Input, OnInit} from '@angular/core';
import {SeasonTrophies} from "../../shared/rest-api-dto/season-trophies.model";
import {map} from "rxjs/operators";
import {plainToInstance} from "class-transformer";
import {HttpClient} from "@angular/common/http";
import {ApiEndpointsService} from "../../shared/api-endpoints.service";
import {MatDialog} from "@angular/material/dialog";
import {EditAdditionalMatchDialogComponent} from "../../league-additional-matches/edit-additional-match-dialog.component";
import {EditHallOfFameDialogComponent} from "./edit-hall-of-fame-dialog.component";

@Component({
  selector: 'app-hall-of-fame',
  templateUrl: './hall-of-fame.component.html',
  styleUrls: ['./hall-of-fame.component.css']
})
export class HallOfFameComponent implements OnInit {

  @Input() isModerator: boolean;
  @Input() leagueUuid: string;
  @Input() seasonTrophies: SeasonTrophies[];

  displayedColumns: string[] = [
    'edit-column',
    'season-number-column',
    'league-1st-column',
    'league-2nd-column',
    'league-3rd-column',
    'cup-1st-column',
    'cup-2nd-column',
    'cup-3rd-column',
    'super-cup-column',
    'pretenders-cup-column',
  ];

  constructor(private http: HttpClient,
              private dialog: MatDialog,
              private apiEndpointsService: ApiEndpointsService) {

  }

  ngOnInit(): void {

  }

  openEditDialog(seasonNumber: number) {
    const dialogRef = this.dialog.open(EditHallOfFameDialogComponent, {
      data: {leagueUuid: this.leagueUuid, seasonNumber: seasonNumber}
    });

    dialogRef.afterClosed()
    .subscribe(
        () => {
          this.reloadTrophies();
        });
  }

  private reloadTrophies() {
    this.http
    .get<SeasonTrophies[]>(this.apiEndpointsService.getSeasonTrophiesForLeagueByUuid(this.leagueUuid))
    .pipe(map(result => plainToInstance(SeasonTrophies, result)))
    .subscribe((result) => {
      this.seasonTrophies = result
    });
  }
}
