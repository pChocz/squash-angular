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
import {Match} from "../shared/rest-api-dto/match.model";
import {EditMatchFootageDialogComponent} from "../shared/modals/edit-match-footage-dialog.component";
import {AdditionalMatchesPerSeason} from "../shared/rest-api-dto/additional-matches-per-season.model";

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

    selectedSeason: AdditionalMatchesPerSeason;
    mostRecentSeason: AdditionalMatchesPerSeason;
    uuid: string;
    league: League;
    leagueLogoBytes: string;
    additionalMatches: AdditionalMatch[];
    additionalMatchesPerSeasonsList: AdditionalMatchesPerSeason[];
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
            .get(this.apiEndpointsService.getLeagueLogo(this.uuid), {responseType: 'text'})
            .subscribe((result) => {
                this.leagueLogoBytes = result;
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

    loadMatches() {
        this.http
            .get<AdditionalMatchesPerSeason[]>(this.apiEndpointsService.getMatchesCountPerSeasonForLeague(this.uuid))
            .pipe(map(result => plainToInstance(AdditionalMatchesPerSeason, result)))
            .subscribe({
                next: (result) => {
                    this.additionalMatchesPerSeasonsList = result;
                    this.mostRecentSeason = result[result.length - 1];

                    if (!this.selectedSeason) {
                        // if it's not initialized we set the most recent season
                        // (it means that user just entered this view)
                        this.selectedSeason = this.mostRecentSeason;

                    } else {
                        // otherwise we need to select the matching one
                        // from the new list (to be able to keep selection
                        // in the select box)
                        let selectedUuid = this.selectedSeason.season.seasonUuid;
                        for (let season of result) {
                            if (season.season.seasonUuid === selectedUuid) {
                                this.selectedSeason = season;
                            }
                        }
                    }

                    this.http
                        .get<AdditionalMatch[]>(this.apiEndpointsService.getAdditionalMatchesForLeagueForSeason(this.uuid, this.selectedSeason.season.seasonNumber))
                        .pipe(map(result => plainToInstance(AdditionalMatch, result)))
                        .subscribe({
                            next: (result) => {
                                this.additionalMatches = result;
                                this.dataSource = new MatTableDataSource<AdditionalMatch>(this.additionalMatches);
                            }
                        });
                }
            });
    }

    isLink(footageLink: string): boolean {
        return footageLink
            && footageLink.startsWith("https://");
    }

    openMatchFootageLinkEditModal(match: Match) {
        const dialogRef = this.dialog.open(EditMatchFootageDialogComponent, {
            data: {match: match},
            autoFocus: false
        });

        dialogRef.afterClosed()
            .subscribe({
                next: (result) => {
                    if (result === true) {
                        this.loadMatches();
                    }
                }
            });
    }

}
