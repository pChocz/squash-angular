import {Component, HostListener, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {Player} from "../shared/rest-api-dto/player.model";
import {map} from "rxjs/operators";
import {plainToInstance} from "class-transformer";
import {PlayerDetailed} from "../shared/rest-api-dto/player-detailed.model";
import {formatDate} from "@angular/common";
import {League} from "../shared/rest-api-dto/league.model";
import {Globals} from "../globals";
import {NotificationService} from "../shared/notification.service";

@Component({
    selector: 'app-new-additional-match-dialog',
    templateUrl: './new-additional-match-dialog.component.html',
})
export class NewAdditionalMatchDialogComponent {

    isLoading: boolean;

    players: Player[];
    player1st: Player;
    player2nd: Player;
    league: League;
    selectedType: string;
    selectedSeasonNumber: number;
    date = new Date();
    types = Globals.MATCH_TYPES;

    constructor(
        private http: HttpClient,
        private notificationService: NotificationService,
        private apiEndpointsService: ApiEndpointsService,
        private dialogRef: MatDialogRef<NewAdditionalMatchDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { league: League, currentPlayer: PlayerDetailed }) {

        this.league = data.league
        this.selectedType = 'FRIENDLY';
        this.selectedSeasonNumber = Math.max.apply(Math, this.league.seasons.map(function (s) {
            return s.seasonNumber;
        }));

        this.http
            .get<Player[]>(this.apiEndpointsService.getLeaguePlayersByUuid(this.league.leagueUuid))
            .pipe(map((result) => plainToInstance(Player, result)))
            .subscribe((result) => {
                this.players = result;
            });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }


    onConfirmClick(): void {
        this.isLoading = true;

        const params = new HttpParams()
            .set('firstPlayerUuid', this.player1st.uuid)
            .set('secondPlayerUuid', this.player2nd.uuid)
            .set('leagueUuid', this.league.leagueUuid)
            .set('seasonNumber', String(this.selectedSeasonNumber))
            .set('date', formatDate(this.date, 'yyyy-MM-dd', 'en-US'))
            .set('type', this.selectedType);

        this.http
            .post<any>(this.apiEndpointsService.getAdditionalMatches(), params)
            .subscribe({
                next: (result) => {
                    this.notificationService.success(
                        'match.addedAdditional',
                        {
                            firstPlayer: this.player1st.username,
                            secondPlayer: this.player2nd.username
                        });
                    this.dialogRef.close();
                },
                error: (error) => {
                    this.notificationService.error('error.general', {error: error});
                    this.dialogRef.close();
                }
            });

    }


    @HostListener('document:keydown', ['$event'])
    handleDeleteKeyboardEvent(event: KeyboardEvent) {
        if (event.key === 'Enter' && this.validData() && !this.isLoading) {
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
        } else if (this.data.currentPlayer.hasRoleForLeague(this.league.leagueUuid, 'MODERATOR')) {
            return true;
        }

        return this.player1st.username === this.data.currentPlayer.username
            || this.player2nd.username === this.data.currentPlayer.username;
    }

}
