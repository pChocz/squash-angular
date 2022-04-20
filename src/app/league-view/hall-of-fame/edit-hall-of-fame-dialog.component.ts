import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";
import {map} from "rxjs/operators";
import {plainToInstance} from "class-transformer";
import {ApiEndpointsService} from "../../shared/api-endpoints.service";
import {SeasonTrophies} from "../../shared/rest-api-dto/season-trophies.model";
import {Player} from "../../shared/rest-api-dto/player.model";

@Component({
    selector: 'app-edit-hall-of-fame-dialog',
    templateUrl: './edit-hall-of-fame-dialog.component.html',
})
export class EditHallOfFameDialogComponent {

    leagueUuid: string;
    seasonNumber: number;
    seasonTrophies: SeasonTrophies;
    leaguePlayers: Player[];

    constructor(
        private router: Router,
        private http: HttpClient,
        private snackBar: MatSnackBar,
        private translateService: TranslateService,
        private apiEndpointsService: ApiEndpointsService,
        public dialogRef: MatDialogRef<EditHallOfFameDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { leagueUuid: string, seasonNumber: number }) {

        this.leagueUuid = data.leagueUuid;
        this.seasonNumber = data.seasonNumber;

        this.loadTrophies();
        this.loadPlayers();
    }

    private loadTrophies() {
        this.http
            .get<SeasonTrophies>(this.apiEndpointsService.getSeasonTrophiesForLeagueByUuidAndSeasonNumber(this.leagueUuid, this.seasonNumber))
            .pipe(map(result => plainToInstance(SeasonTrophies, result)))
            .subscribe((result) => {
                this.seasonTrophies = result;
            });
    }

    private loadPlayers() {
        this.http
            .get<Player[]>(this.apiEndpointsService.getLeaguePlayersByUuid(this.leagueUuid))
            .pipe(map((result) => plainToInstance(Player, result)))
            .subscribe((result) => {
                this.leaguePlayers = result;
            });
    }
}
