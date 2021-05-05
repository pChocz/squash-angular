import {Component, HostListener, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Router} from "@angular/router";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";
import {Player} from "../shared/rest-api-dto/player.model";
import {map} from "rxjs/operators";
import {plainToClass} from "class-transformer";
import {PlayerDetailed} from "../shared/rest-api-dto/player-detailed.model";
import {formatDate} from "@angular/common";
import {League} from "../shared/rest-api-dto/league.model";

@Component({
    selector: 'app-new-additional-match-dialog',
    templateUrl: './new-additional-match-dialog.component.html',
})
export class NewAdditionalMatchDialogComponent {

    players: Player[];
    player1st: Player;
    player2nd: Player;
    league: League;
    selectedType: string;
    selectedSeasonNumber: number;
    date = new Date();
    types = ['BONUS', 'FRIENDLY', 'CUP', 'CUP_FINALE', 'SUPERCUP', 'OTHER'];

    constructor(
        private router: Router,
        private http: HttpClient,
        private snackBar: MatSnackBar,
        private translateService: TranslateService,
        private apiEndpointsService: ApiEndpointsService,
        private dialogRef: MatDialogRef<NewAdditionalMatchDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { leagueUuid: string, currentPlayer: PlayerDetailed }) {

        this.http
            .get<Player[]>(this.apiEndpointsService.getLeaguePlayersByUuid(this.data.leagueUuid))
            .pipe(map((result) => plainToClass(Player, result)))
            .subscribe((result) => {
                this.players = result;
            });

        this.http
            .get<League>(this.apiEndpointsService.getLeagueGeneralInfoByUuid(this.data.leagueUuid))
            .pipe(map((result) => plainToClass(League, result)))
            .subscribe((result) => {
                this.league = result;
            });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }


    onConfirmClick(): void {
        console.log(this.player1st)
        console.log(this.player2nd)
        console.log(this.selectedType)
        console.log(this.date)

        const params = new HttpParams()
            .set('firstPlayerUuid', this.player1st.uuid)
            .set('secondPlayerUuid', this.player2nd.uuid)
            .set('leagueUuid', this.data.leagueUuid)
            .set('seasonNumber', String(this.selectedSeasonNumber))
            .set('date', formatDate(this.date, 'yyyy-MM-dd', 'en-US'))
            .set('type', this.selectedType);

        this.http
            .post<any>(this.apiEndpointsService.getAdditionalMatches(), params)
            .subscribe(
                (result) => {
                    this.translateService
                        .get('..ADDED MATCH..')
                        .subscribe((translation: string) => {
                            this.snackBar.open(translation, 'X', {
                                duration: 7 * 1000,
                                panelClass: ['mat-toolbar', 'mat-primary'],
                            });
                        });
                    this.dialogRef.close();
                },
                (error) => {
                    this.translateService
                        .get('error.general', {error: error})
                        .subscribe((translation: string) => {
                            this.snackBar.open(translation, 'X', {
                                duration: 7 * 1000,
                                panelClass: ['mat-toolbar', 'mat-warn'],
                            });
                        });
                    this.dialogRef.close();
                }
            );

    }


    @HostListener('document:keydown', ['$event'])
    handleDeleteKeyboardEvent(event: KeyboardEvent) {
        if (event.key === 'Enter' && this.validData()) {
            this.onConfirmClick();
        }
    }

    validData(): boolean {
        if (!this.selectedType || !this.player1st || !this.player2nd) {
            return false;
        } else if (this.player1st === this.player2nd) {
            return false;
        } else if (this.data.currentPlayer.isAdmin()) {
            return true;
        } else if (this.data.currentPlayer.hasRoleForLeague(this.data.leagueUuid, 'MODERATOR')) {
            return true;
        }

        return this.player1st.username === this.data.currentPlayer.username
            || this.player2nd.username === this.data.currentPlayer.username;
    }

}
