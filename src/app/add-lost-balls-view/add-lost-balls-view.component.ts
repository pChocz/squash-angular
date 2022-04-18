import { Component, OnInit } from '@angular/core';
import {Season} from "../shared/rest-api-dto/season.model";
import {Player} from "../shared/rest-api-dto/player.model";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MyLoggerService} from "../shared/my-logger.service";
import {AuthService} from "../shared/auth.service";
import {Title} from "@angular/platform-browser";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";
import {map} from "rxjs/operators";
import {plainToInstance} from "class-transformer";
import {formatDate} from "@angular/common";
import {LostBall} from "../shared/rest-api-dto/lost-ball.model";

@Component({
  selector: 'app-add-lost-balls-view',
  templateUrl: './add-lost-balls-view.component.html',
  styleUrls: ['./add-lost-balls-view.component.css']
})
export class AddLostBallsViewComponent implements OnInit {

  seasonUuid: string;
  season: Season;
  players: Player[];
  player: Player;
  currentLostBallsForSeason: LostBall[];
  leagueLogoBytes: string
  date = new Date();
  isModerator: boolean;

  constructor(private http: HttpClient,
              private apiEndpointsService: ApiEndpointsService,
              private route: ActivatedRoute,
              private loggerService: MyLoggerService,
              private authService: AuthService,
              private router: Router,
              private titleService: Title,
              private snackBar: MatSnackBar,
              private translateService: TranslateService) {

  }

  ngOnInit(): void {
    this.route.queryParams
        .subscribe({
          next: (params) => {
            this.seasonUuid = params.seasonUuid;
          }
        });

    this.http
        .get<Player[]>(this.apiEndpointsService.getPlayersBySeasonUuid(this.seasonUuid))
        .pipe(map((result) => plainToInstance(Player, result)))
        .subscribe({
          next: (result) => {
            this.players = result;
          }
        });

    this.http
        .get<Season>(this.apiEndpointsService.getSeasonByUuid(this.seasonUuid))
        .pipe(map((result) => plainToInstance(Season, result)))
        .subscribe({
          next: (result) => {
            this.season = result;
            const leagueUuid = this.season.leagueUuid;
            this.authService.hasRoleForLeague(leagueUuid, 'MODERATOR', false)
                .then((result) => {
                      this.isModerator = result;
                    }
                );
            this.translateService
                .get('lostBalls.titleWithSeason', {seasonNumber: this.season.seasonNumber})
                .subscribe({
                  next: (translation: string) => {
                    this.titleService.setTitle(translation);
                    this.loggerService.log(translation);
                  }
                });
          }
        });

    this.http
        .get(this.apiEndpointsService.getLeagueLogoBySeasonUuid(this.seasonUuid), {responseType: 'text'})
        .subscribe({
          next: (result) => {
            this.leagueLogoBytes = result;
          }
        });

    this.loadCurrentList();
  }

  isProperData(): boolean {
    return this.player !== undefined;
  }

  submit(): void {
    const params = new HttpParams()
        .set('playerUuid', this.player.uuid)
        .set('seasonUuid', this.seasonUuid)
        .set('date', formatDate(this.date, 'yyyy-MM-dd', 'en-US'))
        .set('count', '1');

    this.http
        .post<any>(this.apiEndpointsService.getLostBalls(), params)
        .pipe(map((result) => plainToInstance(LostBall, result)))
        .subscribe({
          next: (result) => {
            this.translateService
                .get('lostBalls.new', {lostBall: result})
                .subscribe({
                  next: (translation: string) => {
                    this.snackBar.open(translation, 'X', {
                      duration: 7 * 1000,
                      panelClass: ['mat-toolbar', 'mat-primary'],
                    });
                    this.loadCurrentList();
                  }
                });
          },
          error: (error) => {
            this.translateService
                .get('error.general', {error: error})
                .subscribe({
                  next: (translation: string) => {
                    this.snackBar.open(translation, 'X', {
                      duration: 7 * 1000,
                      panelClass: ['mat-toolbar', 'mat-warn'],
                    });
                    this.loadCurrentList();
                  }
                });
          }
        });

    this.player = null;
  }

  private loadCurrentList() {
    this.http
        .get<LostBall[]>(this.apiEndpointsService.getLostBallsBySeasonUuid(this.seasonUuid))
        .pipe(map((result) => plainToInstance(LostBall, result)))
        .subscribe({
          next: (result) => {
            this.currentLostBallsForSeason = result;
            console.log(result);
          }
        });
  }

}
