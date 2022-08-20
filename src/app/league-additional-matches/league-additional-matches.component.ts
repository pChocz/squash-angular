import {Component, OnInit} from '@angular/core';
import {AdditionalMatch} from "../shared/rest-api-dto/additional-match.model";
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {map} from "rxjs/operators";
import {plainToInstance} from "class-transformer";
import {MatTableDataSource} from "@angular/material/table";
import {PlayerDetailed} from "../shared/rest-api-dto/player-detailed.model";
import {MatDialog} from "@angular/material/dialog";
import {NewAdditionalMatchDialogComponent} from "./new-additional-match-dialog.component";
import {EditAdditionalMatchDialogComponent} from "./edit-additional-match-dialog.component";
import {League} from "../shared/rest-api-dto/league.model";
import {MyLoggerService} from "../shared/my-logger.service";
import {Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";
import {Season} from "../shared/rest-api-dto/season.model";

@Component({
    selector: 'app-league-additional-matches',
    templateUrl: './league-additional-matches.component.html',
    styleUrls: ['./league-additional-matches.component.css']
})
export class LeagueAdditionalMatchesComponent implements OnInit {

    displayedColumns: string[] = [
        'date-column',
        'type-column',
        'season-number',
        'first-player',
        'first-player-emoji',
        'second-player-emoji',
        'second-player',
        'head-to-head-column',
        'first-set-first-player',
        'first-set-second-player',
        'second-set-first-player',
        'second-set-second-player',
        'third-set-first-player',
        'third-set-second-player',
        'fourth-set-first-player',
        'fourth-set-second-player',
        'fifth-set-first-player',
        'fifth-set-second-player',
        'mod-column',
    ];

    selectedSeason: Season;
    seasons: Season[];
    uuid: string;
    league: League;
    additionalMatches: AdditionalMatch[];
    currentPlayer: PlayerDetailed;
    dataSource: MatTableDataSource<AdditionalMatch>;

    constructor(private route: ActivatedRoute,
                private loggerService: MyLoggerService,
                private http: HttpClient,
                private titleService: Title,
                private dialog: MatDialog,
                private translateService: TranslateService,
                private apiEndpointsService: ApiEndpointsService) {

    }

    ngOnInit(): void {
        this.route
            .params
            .subscribe(params => {
                this.uuid = params['uuid'];
            });

        this.http
            .get<League>(this.apiEndpointsService.getLeagueGeneralInfoByUuid(this.uuid))
            .pipe(map((result) => plainToInstance(League, result)))
            .subscribe({
                next: (result) => {
                    this.league = result;
                    this.seasons = this.league.seasons;
                    this.selectedSeason = this.getMostRecentSeason();
                    this.translateService
                        .get('league.additionalMatches')
                        .subscribe({
                            next: (translation: string) => {
                                this.titleService.setTitle(translation + " | " + this.league.leagueName);
                                this.loggerService.log(translation + " | " + this.league.leagueName);
                            }
                        });
                    this.loadMatches();
                }
            });

        this.http
            .get<PlayerDetailed>(this.apiEndpointsService.getAboutMeInfo())
            .pipe(map((result) => plainToInstance(PlayerDetailed, result)))
            .subscribe({
                next: (result) => {
                    this.currentPlayer = result;
                }
            });
    }

    shouldBeHidden(match: AdditionalMatch): boolean {
        if (this.currentPlayer.isAdmin() || (this.currentPlayer.hasRoleForLeague(this.uuid, 'MODERATOR'))) {
            return false;

        } else if (match.status === 'FINISHED') {
            return true;

        } else {
            return match.firstPlayer.username !== this.currentPlayer.username
                && match.secondPlayer.username !== this.currentPlayer.username;
        }
    }

    modify(match: AdditionalMatch) {
        const dialogRef = this.dialog.open(EditAdditionalMatchDialogComponent, {
            // width: '550px',
            data: {matchUuid: match.matchUuid},
            autoFocus: false
        });

        dialogRef.afterClosed()
            .subscribe({
                next: () => {
                    this.loadMatches();
                }
            });
    }

    openNewAdditionalMatchDialog(): void {
        const dialogRef = this.dialog.open(NewAdditionalMatchDialogComponent, {
            data: {league: this.league, currentPlayer: this.currentPlayer},
            autoFocus: false
        });

        dialogRef.afterClosed()
            .subscribe({
                next: () => {
                    this.loadMatches();
                }
            });
    }

    applyFilter(season: Season) {
        if (season) {
            this.dataSource.filter = season.seasonNumber.toString();
        }
    }

    private loadMatches() {
        this.http
            .get<AdditionalMatch[]>(this.apiEndpointsService.getAllAdditionalMatchesForLeague(this.uuid))
            .pipe(map(result => plainToInstance(AdditionalMatch, result)))
            .subscribe({
                next: (result) => {
                    this.additionalMatches = result;
                    this.dataSource = new MatTableDataSource<AdditionalMatch>(this.additionalMatches);
                    this.dataSource.filterPredicate = function (match, filter: string): boolean {
                        return match.seasonNumber.toString() === filter;
                    };
                    this.applyFilter(this.selectedSeason);
                }
            });
    }

    private getMostRecentSeason(): Season {
        return this.seasons
            .reduce(function (prev, current) {
                return (prev.seasonNumber > current.seasonNumber) ? prev : current
            })
    }

    getNumberOfMatches(season: Season): number {
        return this.additionalMatches
            .filter(match => match.seasonNumber === season.seasonNumber)
            .length;
    }

    isLink(footageLink: string): boolean {
        return footageLink
            && footageLink.startsWith("https://");
    }

}
