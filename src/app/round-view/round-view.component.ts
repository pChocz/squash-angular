import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {RoundScoreboard} from '../shared/rest-api-dto/round-scoreboard.model';
import {plainToClass} from 'class-transformer';
import {map} from 'rxjs/operators';
import {DomSanitizer, Title} from '@angular/platform-browser';
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {TranslateService} from "@ngx-translate/core";
import {MyLoggerService} from "../shared/my-logger.service";
import {Match} from "../shared/rest-api-dto/match.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {AuthService} from "../shared/auth.service";

@Component({
  selector: 'app-round-view',
  templateUrl: './round-view.component.html',
  styleUrls: ['./round-view.component.css'],
})
export class RoundViewComponent implements OnInit {

  durationInSeconds = 7;
  uuid: string;
  tab: number;
  roundScoreboard: RoundScoreboard;
  leagueLogoBytes: string;
  previousRoundUuid: string;
  nextRoundUuid: string;
  editMode: boolean;
  isModerator: boolean;

  constructor(
      private route: ActivatedRoute,
      private loggerService: MyLoggerService,
      private authService: AuthService,
      private dialog: MatDialog,
      private http: HttpClient,
      private sanitizer: DomSanitizer,
      private snackBar: MatSnackBar,
      private apiEndpointsService: ApiEndpointsService,
      private router: Router,
      private titleService: Title,
      private translateService: TranslateService) {
    this.editMode = false;
  }

  ngOnInit(): void {
    this.route
    .params
    .subscribe((params) => {
      if (params.uuid !== this.uuid) {
        this.setupComponent(params.uuid);
      }
      this.tab = params['tab'];
      this.switchTab(this.tab);
    });
  }

  setupComponent(roundUuid: string) {
    this.roundScoreboard = null;
    this.uuid = roundUuid;

    this.http
    .get<any>(this.apiEndpointsService.getAdjacentRounds(this.uuid))
    .subscribe((result) => {
      console.log(result);
      this.previousRoundUuid = result.first;
      this.nextRoundUuid = result.second;
    });

    this.http
    .get<RoundScoreboard>(this.apiEndpointsService.getRoundScoreboardByUuid(this.uuid))
    .pipe(map((result) => plainToClass(RoundScoreboard, result)))
    .subscribe((result) => {
      this.roundScoreboard = result;
      const leagueUuid = this.roundScoreboard.leagueUuid;
      this.authService.hasRoleForLeague(leagueUuid, 'MODERATOR', false)
      .then((result) => {
            this.isModerator = result;
          }
      );

      this.translateService
      .get('dynamicTitles.round',
          {
            roundNumber: this.roundScoreboard.roundNumber,
            seasonNumber: this.roundScoreboard.seasonNumberRoman,
            leagueName: this.roundScoreboard.leagueName
          }
      )
      .subscribe((res: string) => {
        this.titleService.setTitle(res);
        this.loggerService.log(res);
      });
      this.loadLogo();
    });

  }

  printRound() {
    window.print();
  }

  switchTab(index: number): void {
    if (index === -1) {
      index = 0;
    }
    this.tab = index;
    this.router.navigate(['/round', this.uuid, this.tab]);
  }

  private loadLogo(): void {
    this.http
    .get(this.apiEndpointsService.getLeagueLogoByRoundUuid(this.uuid), {responseType: 'text'})
    .subscribe((result) => {
      this.leagueLogoBytes = result;
    });
  }

  updating(event: any): void {
    const updatedMatch: Match = event;

    this.http
    .get<RoundScoreboard>(this.apiEndpointsService.getRoundScoreboardByUuid(this.uuid))
    .pipe(map((result) => plainToClass(RoundScoreboard, result)))
    .subscribe(
        (result) => {
          this.roundScoreboard = result;
        },
        (error) => {
          console.log(error);
        }
    );
  }

  public toggleEditMode() {
    this.editMode = !this.editMode;
  }

  public toggleRoundState() {
    const newVal: boolean = !this.roundScoreboard.finishedState;

    this.http
    .put(this.apiEndpointsService.getRoundStateUpdate(this.roundScoreboard.roundUuid, newVal), {})
    .subscribe(
        () => {
          console.log('Changed Round state!');
          this.setupComponent(this.uuid);
        },
        (error) => {
          console.log('Error when changing state of the round: ', error);
          this.setupComponent(this.uuid);
        }
    );
  }

  roundRemoveConfirmationDialog(): void {
    const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {message: 'round.remove.areYouSure'}
    });

    confirmationDialogRef.afterClosed()
    .subscribe(
        result => {
          if (result === true) {
            const seasonUuid = this.roundScoreboard.seasonUuid;
            this.roundScoreboard = null;
            this.http
            .delete(this.apiEndpointsService.getRoundByUuid(this.uuid))
            .subscribe(() => {
              this.router.navigate(['season', seasonUuid]);
            });
          }
        });
  };

}
