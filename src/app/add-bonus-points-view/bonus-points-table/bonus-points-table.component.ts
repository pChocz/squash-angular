import {Component, Input, OnInit} from '@angular/core';
import {BonusPoint} from "../../shared/rest-api-dto/bonus-point.model";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../../shared/auth.service";

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

    submitRemoval(bonusPoint: BonusPoint) {
        this.http
            .delete(environment.apiUrl + 'bonusPoints/' + bonusPoint.uuid)
            .subscribe(() => {
                this.snackBar.open("Removed: " + bonusPoint, 'X', {
                    duration: 7 * 1000,
                    panelClass: ['mat-toolbar', 'mat-primary'],
                });
                this.bonusPoints = this.bonusPoints.filter(bp => bp.uuid !== bonusPoint.uuid);
            });
    }

    constructor(private http: HttpClient,
                private snackBar: MatSnackBar,
                private authService: AuthService) {
    }

    ngOnInit(): void {
        this.authService.hasRoleForLeagueForSeason(this.seasonUuid, 'MODERATOR')
            .then((data) => {
                this.removalColumnHidden = !data;
                console.log(this.removalColumnHidden);
            });
    }

}
