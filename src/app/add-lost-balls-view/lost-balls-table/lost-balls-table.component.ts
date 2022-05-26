import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../shared/auth.service";
import {ApiEndpointsService} from "../../shared/api-endpoints.service";
import {ConfirmationDialogComponent} from "../../confirmation-dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {LostBall} from "../../shared/rest-api-dto/lost-ball.model";
import {NotificationService} from "../../shared/notification.service";

@Component({
    selector: 'app-lost-balls-table',
    templateUrl: './lost-balls-table.component.html',
    styleUrls: ['./lost-balls-table.component.css'],
})
export class LostBallsTableComponent implements OnInit {

    @Input() lostBalls: LostBall[];
    @Input() seasonUuid: string;
    removalColumnHidden: boolean;

    displayedColumns: string[] = [
        'date',
        'player',
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

    lostBallConfirmationDialog(lostBall: LostBall): void {
        const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {message: 'lostBalls.remove.areYouSure', isRemoval: true},
            autoFocus: false
        });

        confirmationDialogRef.afterClosed()
            .subscribe({
                next: (result) => {
                    if (result === true) {
                        this.http
                            .delete(this.apiEndpointsService.getLostBallByUuid(lostBall.uuid))
                            .subscribe({
                                next: () => {
                                    this.notificationService.success('lostBalls.remove.done', {lostBall: lostBall});
                                    this.lostBalls = this.lostBalls.filter(bp => bp.uuid !== lostBall.uuid);
                                }
                            });
                    }
                }
            });
    }

}
