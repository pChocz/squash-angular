import {Component, Input, OnInit} from '@angular/core';
import {BonusPoint} from "../../shared/rest-api-dto/bonus-point.model";
import {HttpClient} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../../shared/auth.service";
import {ApiEndpointsService} from "../../shared/api-endpoints.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-bonus-points-table',
  templateUrl: './bonus-points-table.component.html',
  styleUrls: ['./bonus-points-table.component.css'],
})
export class BonusPointsTableComponent implements OnInit {

  @Input() bonusPoints: BonusPoint[];
  @Input() seasonUuid: string;
  removalColumnHidden: boolean;

  displayedColumns: string[] = [
    'date',
    'winner',
    'points',
    'looser',
    'remove',
  ];

  constructor(private http: HttpClient,
              private apiEndpointsService: ApiEndpointsService,
              private snackBar: MatSnackBar,
              private authService: AuthService,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.authService.hasRoleForLeagueForSeason(this.seasonUuid, 'MODERATOR', false)
    .then((data) => {
      this.removalColumnHidden = !data;
    });
  }

  submitRemoval(bonusPoint: BonusPoint) {
    this.http
    .delete(this.apiEndpointsService.getBonusPointByUuid(bonusPoint.uuid))
    .subscribe(() => {
      this.translateService
      .get('bonusPoints.removed', {bonus: bonusPoint})
      .subscribe((translation: string) => {
        this.snackBar.open(translation, 'X', {
          duration: 7 * 1000,
          panelClass: ['mat-toolbar', 'mat-primary'],
        });
        this.bonusPoints = this.bonusPoints.filter(bp => bp.uuid !== bonusPoint.uuid);
      });

    });
  }

}
