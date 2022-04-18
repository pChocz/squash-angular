import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../../shared/auth.service";
import {ApiEndpointsService} from "../../shared/api-endpoints.service";
import {TranslateService} from "@ngx-translate/core";
import {ConfirmationDialogComponent} from "../../confirmation-dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {LostBall} from "../../shared/rest-api-dto/lost-ball.model";

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
                                    this.translateService
                                        .get('lostBalls.remove.done', {lostBall: lostBall})
                                        .subscribe({
                                            next: (translation: string) => {
                                                this.snackBar.open(translation, 'X', {
                                                    duration: 7 * 1000,
                                                    panelClass: ['mat-toolbar', 'mat-primary'],
                                                });
                                                this.lostBalls = this.lostBalls.filter(bp => bp.uuid !== lostBall.uuid);
                                            }
                                        });

                                }
                            });
                    }
                }
            });
    }

}
