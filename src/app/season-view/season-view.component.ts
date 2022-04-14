import {Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {SeasonScoreboard} from '../shared/rest-api-dto/season-scoreboard.model';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {plainToInstance} from 'class-transformer';
import {SeasonScoreboardRow} from '../shared/rest-api-dto/season-scoreboard-row.model';
import {Title} from '@angular/platform-browser';
import {Subject} from 'rxjs';
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {TranslateService} from "@ngx-translate/core";
import {MyLoggerService} from "../shared/my-logger.service";
import {AuthService} from "../shared/auth.service";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {SeasonModifyDialogComponent} from "./season-modify-dialog.component";

@Component({
    selector: 'app-season-view',
    templateUrl: './season-view.component.html',
    styleUrls: ['./season-view.component.css'],
})
export class SeasonViewComponent implements OnInit, OnDestroy {

    destroy$: Subject<boolean> = new Subject<boolean>();
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    isSmall: boolean;

    selectedType: string;
    dataSource: MatTableDataSource<SeasonScoreboardRow>;
    uuid: string;
    seasonScoreboard: SeasonScoreboard;
    isLoading: boolean;
    noData: boolean;
    leagueLogoBytes: string;
    isModerator: boolean;
    previousSeasonUuid: string;
    nextSeasonUuid: string;

    constructor(private loggerService: MyLoggerService,
                private router: Router,
                private route: ActivatedRoute,
                private http: HttpClient,
                private authService: AuthService,
                private dialog: MatDialog,
                private apiEndpointsService: ApiEndpointsService,
                private titleService: Title,
                private translateService: TranslateService) {

        this.modifyTableSizeBasedOnScreenWidth();
    }

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            this.setupComponent(params.uuid);
        });
    }

    setupComponent(seasonUuid: string) {
        this.isLoading = true;
        this.noData = false;
        this.seasonScoreboard = null;
        this.uuid = seasonUuid;

        this.http
            .get<any>(this.apiEndpointsService.getAdjacentSeasons(this.uuid))
            .subscribe((result) => {
                this.previousSeasonUuid = result.first;
                this.nextSeasonUuid = result.second;
            });

        this.http
            .get<SeasonScoreboard>(this.apiEndpointsService.getSeasonScoreboardByUuid(this.uuid))
            .pipe(map((result) => plainToInstance(SeasonScoreboard, result)))
            .subscribe(
                result => {
                    this.seasonScoreboard = result;
                    const leagueUuid = this.seasonScoreboard.season.leagueUuid;

                    this.authService.hasValidToken() && this.authService.hasRoleForLeague(leagueUuid, 'MODERATOR', false)
                        .then((result) => {
                                this.isModerator = result;
                            }
                        );

                    if (this.seasonScoreboard.seasonScoreboardRows.length === 0) {
                        this.noData = true;
                    }

                    this.translateService
                        .get('dynamicTitles.season',
                            {
                                seasonNumber: this.seasonScoreboard.season.seasonNumber,
                                leagueName: this.seasonScoreboard.season.leagueName
                            })
                        .subscribe((translation: string) => {
                            this.titleService.setTitle(translation);
                            this.loggerService.log(translation);
                        });

                    this.dataSource = new MatTableDataSource(
                        this.seasonScoreboard.seasonScoreboardRows
                    );
                    this.dataSource.sort = this.sort;

                    this.dataSource.sortingDataAccessor = (item, property) => {
                        if (property.startsWith('r')) {
                            const roundNumber: number = Number(
                                property.substring(1)
                            );
                            return item.roundNumberToXpMapAll[roundNumber];
                        } else {
                            return item[property];
                        }
                    };
                    this.isLoading = false;
                    this.loadLogo();
                },
                error => {
                    console.log(error);
                },
                () => {
                    this.isLoading = false;
                });
    }

    loadLogo(): void {
        this.http
            .get(this.apiEndpointsService.getLeagueLogoBySeasonUuid(this.uuid), {responseType: 'text'})
            .subscribe(
                result => {
                    this.leagueLogoBytes = result;
                },
                error => {
                    console.log(error);
                });
    }

    toggleScoreboardView(): void {
        if (this.selectedType === 'FULL') {
            this.selectedType = 'MINIFIED';

        } else if (this.selectedType === 'MINIFIED') {
            this.selectedType = 'BALANCE';

        } else /* must be 'BALANCE' */{
            this.selectedType = 'FULL';
        }
    }

    openSeasonModifyDialog() {
        const dialogRef = this.dialog.open(SeasonModifyDialogComponent, {
            data: {seasonUuid: this.seasonScoreboard.season.seasonUuid},
            autoFocus: false
        });

        dialogRef.afterClosed()
            .subscribe(
                (result) => {
                    if (result === true) {
                        this.setupComponent(this.uuid);
                    }
                });
    }

    openRemoveSeasonConfirmationDialog(): void {
        const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {message: 'season.remove.areYouSure', isRemoval: true},
            autoFocus: false
        });

        confirmationDialogRef.afterClosed()
            .subscribe(
                result => {
                    if (result === true) {
                        const leagueUuid = this.seasonScoreboard.season.leagueUuid;
                        this.seasonScoreboard = null;
                        this.isLoading = true;
                        this.noData = false;
                        this.http
                            .delete(this.apiEndpointsService.getSeasonByUuid(this.uuid))
                            .subscribe(() => {
                                this.router.navigate(['league', leagueUuid]);
                            });
                    }
                });
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    @HostListener('window:resize', ['$event'])
    modifyTableSizeBasedOnScreenWidth(event?) {
        let currentWidth = window.innerWidth;
        if (currentWidth < 576 && !this.isSmall) {
            this.isSmall = true;
            this.selectedType = "MINIFIED";

        } else if (currentWidth > 576 && this.isSmall) {
            this.isSmall = false;
            this.selectedType = "FULL";
        }
    }

}
