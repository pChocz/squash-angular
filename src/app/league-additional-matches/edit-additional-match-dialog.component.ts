import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";
import {Player} from "../shared/rest-api-dto/player.model";
import {map} from "rxjs/operators";
import {plainToInstance} from "class-transformer";
import {PlayerDetailed} from "../shared/rest-api-dto/player-detailed.model";
import {AdditionalMatch} from "../shared/rest-api-dto/additional-match.model";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import {MyLoggerService} from "../shared/my-logger.service";
import {Globals} from "../globals";

@Component({
    selector: 'app-edit-additional-match-dialog',
    templateUrl: './edit-additional-match-dialog.component.html',
})
export class EditAdditionalMatchDialogComponent {

    players: Player[];
    player1st: Player;
    player2nd: Player;
    selectedType: string;
    date = new Date();

    types = Globals.MATCH_TYPES;

    match: AdditionalMatch;
    currentPlayer: PlayerDetailed;

    constructor(private router: Router,
                private http: HttpClient,
                private snackBar: MatSnackBar,
                private loggerService: MyLoggerService,
                private translateService: TranslateService,
                private apiEndpointsService: ApiEndpointsService,
                private dialog: MatDialog,
                private dialogRef: MatDialogRef<EditAdditionalMatchDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: { matchUuid: string }) {

        this.loadMatch(data.matchUuid);
    }

    onOkClick(): void {
        this.dialogRef.close();
    }

    onDeleteClick(): void {
        const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {message: 'areYouSureToDeleteMatch', isRemoval: true},
            autoFocus: false
        });

        confirmationDialogRef.afterClosed()
            .subscribe({
                next: (result) => {
                    if (result === true) {
                        this.http
                            .delete<AdditionalMatch>(this.apiEndpointsService.getAdditionalMatchByUuid(this.match.matchUuid))
                            .subscribe({
                                next: () => {
                                    this.dialogRef.close();
                                }
                            });
                    }
                }
            });
    }

    onChange(newValue: number, match: AdditionalMatch, setNumber: number, player: string): void {
        this.http
            .put<AdditionalMatch>(this.apiEndpointsService.getAdditionalMatchByUuid(match.matchUuid),
                {},
                {
                    params: {
                        setNumber: setNumber.toString(),
                        player,
                        newScore: newValue.toString(),
                    }
                }
            )
            .subscribe({
                next: () => {
                    this.loadMatch(match.matchUuid);
                }
            });
    }

    private loadMatch(matchUuid: string) {
        this.http
            .get<AdditionalMatch>(this.apiEndpointsService.getAdditionalMatchByUuid(matchUuid))
            .pipe(map((result) => plainToInstance(AdditionalMatch, result)))
            .subscribe({
                next: (result) => {
                    this.match = result;
                    this.loggerService.log("MATCH: " + this.match, false);
                }
            });
    }

}
