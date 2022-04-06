import {HttpClient, HttpParams} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {Player} from "../shared/rest-api-dto/player.model";
import {map} from "rxjs/operators";
import {plainToInstance} from "class-transformer";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Season} from "../shared/rest-api-dto/season.model";
import {BonusPoint} from "../shared/rest-api-dto/bonus-point.model";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {TranslateService} from "@ngx-translate/core";
import {formatDate} from "@angular/common";
import {MyLoggerService} from "../shared/my-logger.service";
import {AuthService} from "../shared/auth.service";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";

@Component({
    selector: 'app-add-bonus-points-view',
    templateUrl: './add-bonus-points-view.component.html',
    styleUrls: ['./add-bonus-points-view.component.css'],
})
export class AddBonusPointsViewComponent implements OnInit {

    seasonUuid: string;
    season: Season;
    players: Player[];
    winner: Player;
    looser: Player;
    points: number;
    currentBonusPointsForSeason: BonusPoint[];
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
                        .get('bonusPoints.titleWithSeason', {seasonNumber: this.season.seasonNumber})
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
        return this.winner !== this.looser && this.points > 0
    }

    submit(): void {
        const params = new HttpParams()
            .set('winnerUuid', this.winner.uuid)
            .set('looserUuid', this.looser.uuid)
            .set('seasonUuid', this.seasonUuid)
            .set('date', formatDate(this.date, 'yyyy-MM-dd', 'en-US'))
            .set('points', String(this.points));

        this.http
            .post<any>(this.apiEndpointsService.getBonusPoints(), params)
            .pipe(map((result) => plainToInstance(BonusPoint, result)))
            .subscribe({
                next: (result) => {
                    this.translateService
                        .get('bonusPoints.new', {bonus: result})
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

        this.winner = null;
        this.looser = null;
        this.points = null;
    }

    private loadCurrentList() {
        this.http
            .get<BonusPoint[]>(this.apiEndpointsService.getBonusPointsBySeasonUuid(this.seasonUuid))
            .pipe(map((result) => plainToInstance(BonusPoint, result)))
            .subscribe({
                next: (result) => {
                    this.currentBonusPointsForSeason = result;
                }
            });
    }

}
