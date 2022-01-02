import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {HttpClient, HttpParams} from "@angular/common/http";
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
      private dialog: MatDialog,
      private dialogRef: MatDialogRef<EditHallOfFameDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { leagueUuid: string, seasonNumber: number }) {

    this.leagueUuid = data.leagueUuid;
    this.seasonNumber = data.seasonNumber;

    this.loadTrophies();
    this.loadPlayers();
  }

  onOkClick(): void {
    this.dialogRef.close();
  }

  // onChange(newValue: number, match: AdditionalMatch, setNumber: number, player: string): void {
  //   this.http
  //   .put<AdditionalMatch>(this.apiEndpointsService.getAdditionalMatchByUuid(match.matchUuid),
  //       {},
  //       {
  //         params: {
  //           setNumber: setNumber.toString(),
  //           player,
  //           newScore: newValue.toString(),
  //         }
  //       }
  //   )
  //   .subscribe(
  //       () => {
  //         this.loadMatch();
  //       }
  //   );
  // }

  changeTrophy(trophyType: string, newPlayer: Player) {
    if (newPlayer === null) {
      let previousPlayer: Player = this.seasonTrophies.findPlayerForTrophy(trophyType);
      if (previousPlayer) {
        let params = new HttpParams()
        .set('playerUuid', previousPlayer.uuid)
        .set('leagueUuid', this.leagueUuid)
        .set('seasonNumber', this.seasonNumber)
        .set('trophy', trophyType);

        this.http
        .delete<any>(this.apiEndpointsService.getTrophies(), {params: params})
        .subscribe(() => {
          console.log('SUCCESS!');
          this.loadTrophies();
        });
      }

    } else {
      let previousPlayer: Player = this.seasonTrophies.findPlayerForTrophy(trophyType);
      console.log(trophyType);
      console.log(newPlayer);

      let params = new HttpParams()
      .set('newPlayerUuid', newPlayer.uuid)
      .set('leagueUuid', this.leagueUuid)
      .set('seasonNumber', this.seasonNumber)
      .set('trophy', trophyType);

      if (previousPlayer) {
        params = params.set('previousPlayerUuid', previousPlayer.uuid);
      }

      console.log(params);

      this.http
      .put<any>(this.apiEndpointsService.getTrophies(), {}, {params: params})
      .subscribe(() => {
        console.log('SUCCESS!');
        this.loadTrophies();
      });
    }

  }

  getMatchingPlayer(trophyType: string) {
    let playerToFind: Player = this.seasonTrophies.findPlayerForTrophy(trophyType);
    if (playerToFind) {
      return this
      .leaguePlayers
      .filter(player => player.uuid === playerToFind.uuid)
      .pop();
    } else {
      return undefined;
    }
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
