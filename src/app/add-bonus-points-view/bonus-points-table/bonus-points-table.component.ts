import {Component, Input, OnInit} from '@angular/core';
import {BonusPoint} from "../../shared/rest-api-dto/bonus-point.model";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../shared/auth.service";
import {ApiEndpointsService} from "../../shared/api-endpoints.service";
import {ConfirmationDialogComponent} from "../../confirmation-dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {NotificationService} from "../../shared/notification.service";

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
        'winner-emoji',
        'points',
        'looser-emoji',
        'looser',
        'remove',
    ];

    constructor(private http: HttpClient,
                private apiEndpointsService: ApiEndpointsService,
                private dialog: MatDialog,
                private notificationService: NotificationService,
                private authService: AuthService) {
    }

    ngOnInit(): void {
        this.authService.hasRoleForLeagueForSeason(this.seasonUuid, 'MODERATOR', false)
            .then((data) => {
                this.removalColumnHidden = !data;
            });
    }

    bonusPointConfirmationDialog(bonusPoint: BonusPoint): void {
        const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {message: 'bonusPoints.remove.areYouSure', isRemoval: true},
            autoFocus: false
        });

        confirmationDialogRef.afterClosed()
            .subscribe({
                next: (result) => {
                    if (result === true) {
                        this.http
                            .delete(this.apiEndpointsService.getBonusPointByUuid(bonusPoint.uuid))
                            .subscribe({
                                next: () => {
                                    this.notificationService.success('bonusPoints.remove.done', {bonus: bonusPoint})
                                    this.bonusPoints = this.bonusPoints.filter(bp => bp.uuid !== bonusPoint.uuid);
                                }
                            });
                    }
                }
            });
    }

}
