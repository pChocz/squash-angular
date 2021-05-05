import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";
import {Player} from "../shared/rest-api-dto/player.model";
import {map} from "rxjs/operators";
import {plainToClass} from "class-transformer";
import {PlayerDetailed} from "../shared/rest-api-dto/player-detailed.model";
import {AdditionalMatch} from "../shared/rest-api-dto/additional-match.model";

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
    types = ['BONUS', 'FRIENDLY', 'CUP', 'CUP_FINALE', 'SUPERCUP', 'OTHER'];

    match: AdditionalMatch;
    currentPlayer: PlayerDetailed;

    constructor(
        private router: Router,
        private http: HttpClient,
        private snackBar: MatSnackBar,
        private translateService: TranslateService,
        private apiEndpointsService: ApiEndpointsService,
        private dialogRef: MatDialogRef<EditAdditionalMatchDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { matchUuid: string }) {

        this.loadMatch(data.matchUuid);
    }

    onOkClick(): void {
        this.dialogRef.close();
    }

    onDeleteClick(): void {
        this.http
            .delete<AdditionalMatch>(this.apiEndpointsService.getAdditionalMatchByUuid(this.match.matchUuid))
            .subscribe(
                () => {
                    this.dialogRef.close();
                }
            );
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
            .subscribe(
                () => {
                    this.loadMatch(match.matchUuid);
                }
            );
    }

    private loadMatch(matchUuid: string) {
        this.http
            .get<AdditionalMatch>(this.apiEndpointsService.getAdditionalMatchByUuid(matchUuid))
            .pipe(map((result) => plainToClass(AdditionalMatch, result)))
            .subscribe(
                result => {
                    this.match = result;
                    console.log(this.match);
                }
            );
    }

}
