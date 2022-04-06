import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Player} from '../shared/rest-api-dto/player.model';
import {map} from 'rxjs/operators';
import {plainToInstance} from 'class-transformer';
import {Season} from '../shared/rest-api-dto/season.model';
import {Title} from '@angular/platform-browser';
import {XpPointsPerRound} from '../shared/rest-api-dto/xp-points-per-round.model';
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {TranslateService} from "@ngx-translate/core";
import {RoundScoreboard} from "../shared/rest-api-dto/round-scoreboard.model";
import {SeasonScoreboard} from "../shared/rest-api-dto/season-scoreboard.model";
import {SeasonStar} from "../shared/rest-api-dto/season-star.model";
import {SeasonScoreboardRow} from "../shared/rest-api-dto/season-scoreboard-row.model";
import {MyLoggerService} from "../shared/my-logger.service";

@Component({
    selector: 'app-recreate-round-view',
    templateUrl: './recreate-round-view.component.html',
    styleUrls: ['./recreate-round-view.component.css'],
})
export class RecreateRoundViewComponent implements OnInit {

    isLoading: boolean;

    // route params
    roundUuid: string;
    seasonUuid: string;

    roundScoreboard: RoundScoreboard;
    season: Season;
    leagueLogoBytes: string

    seasonScoreboard: SeasonScoreboard;
    numberOfGroups = 4;
    availableNumberOfGroups: number[] = [];
    selectedPlayersGroup: Map<number, Player[]> = new Map();
    roundDate: Date = new Date();

    xpPointsPerRound: XpPointsPerRound[];
    availableSplits: string[] = [];
    currentSplit: string;

    constructor(private route: ActivatedRoute,
                private http: HttpClient,
                private loggerService: MyLoggerService,
                private apiEndpointsService: ApiEndpointsService,
                private router: Router,
                private titleService: Title,
                private translateService: TranslateService) {
        this.isLoading = true;
    }

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            this.seasonUuid = params.seasonUuid;
            this.roundUuid = params.roundUuid;
        });

        this.http
            .get<Season>(this.apiEndpointsService.getSeasonByUuid(this.seasonUuid))
            .pipe(map((result) => plainToInstance(Season, result)))
            .subscribe({
                next: (result) => {
                    this.season = result;
                    this.http
                        .get<XpPointsPerRound[]>(this.apiEndpointsService.getAllXpPointsOfType(this.season.xpPointsType))
                        .pipe(map((result) => plainToInstance(XpPointsPerRound, result)))
                        .subscribe({
                            next: (result) => {
                                this.xpPointsPerRound = result;
                                this.xpPointsPerRound.forEach((xpPoints) => {
                                    this.availableSplits.push(xpPoints.split);
                                });
                            }
                        });
                }
            });

        for (let i = 1; i <= this.numberOfGroups; i++) {
            this.availableNumberOfGroups.push(i)
            this.selectedPlayersGroup.set(i, []);
        }

        this.http
            .get<SeasonScoreboard>(this.apiEndpointsService.getSeasonScoreboardByUuid(this.seasonUuid))
            .pipe(map((result) => plainToInstance(SeasonScoreboard, result)))
            .subscribe((result) => {
                this.seasonScoreboard = result;

                // round scoreboard
                this.http
                    .get<RoundScoreboard>(this.apiEndpointsService.getRoundScoreboardByUuid(this.roundUuid))
                    .pipe(map((result) => plainToInstance(RoundScoreboard, result)))
                    .subscribe((result) => {
                        this.roundScoreboard = result;
                        this.isLoading = false;
                        this.roundDate = this.roundScoreboard.roundDate;

                        // set title now
                        this.translateService
                            .get('dynamicTitles.recreateRound',
                                {
                                    roundNumber: this.roundScoreboard.roundNumber,
                                    seasonNumber: this.roundScoreboard.seasonNumberRoman,
                                    leagueName: this.roundScoreboard.leagueName
                                }
                            ).subscribe((translation: string) => {
                            this.titleService.setTitle(translation);
                            this.loggerService.log(translation);
                        });

                        // we still need to add players to the list that were not playing in any round of current season
                        this.http
                            .get<Player[]>(this.apiEndpointsService.getLeaguePlayersByUuid(this.seasonScoreboard.season.leagueUuid))
                            .pipe(map((result) => plainToInstance(Player, result)))
                            .subscribe({
                                next: (result) => {
                                    const allLeaguePlayers = result;
                                    const alreadyExistingPlayers: Player[] = this.seasonScoreboard.seasonScoreboardRows.map(row => row.player);
                                    const alreadyExistingPlayersUuids: string[] = alreadyExistingPlayers.map(player => player.uuid);
                                    for (const player of allLeaguePlayers) {
                                        if (alreadyExistingPlayersUuids.indexOf(player.uuid) < 0) {
                                            this.seasonScoreboard.seasonScoreboardRows.push(new SeasonScoreboardRow(player));
                                        }
                                    }
                                }
                            });

                        // preselect
                        this.preselectPlayersBasedOnRound();
                        this.buildSplitBasedOnSelections();
                    });
            });

        this.http
            .get(this.apiEndpointsService.getLeagueLogoBySeasonUuid(this.seasonUuid), {responseType: 'text'})
            .subscribe((result) => {
                this.leagueLogoBytes = result;
            });
    }

    onCheckboxChange(player: Player, groupNumber: number, selected: boolean): void {
        if (selected) {
            this.selectedPlayersGroup.get(groupNumber).push(player);
        } else {
            this.selectedPlayersGroup.set(
                groupNumber,
                this.selectedPlayersGroup.get(groupNumber).filter((item) => item.uuid !== player.uuid)
            );
        }
        this.buildSplitBasedOnSelections();
    }

    buildSplitBasedOnSelections(): void {
        const split = [];
        for (const [key, value] of this.selectedPlayersGroup) {
            if (value.length === 0) {
                break;
            } else {
                split.push(value.length);
            }
        }
        this.currentSplit = split.join(' | ');
    }

    isSelectionValid(): boolean {
        const isValidSplit = this.availableSplits.some((split) => split === this.currentSplit);
        const noOverlappingPlayers = this.checkNoOverlappingPlayers();
        const noEmptyGroupsInBetween = this.checkNoEmptyGroupsInBetween();
        return isValidSplit && noOverlappingPlayers && noEmptyGroupsInBetween;
    }

    checkNoEmptyGroupsInBetween(): boolean {
        const splitProper = [];
        for (const [key, value] of this.selectedPlayersGroup) {
            if (value.length === 0) {
                break;
            } else {
                splitProper.push(value.length);
            }
        }

        const splitGeneral = [];
        for (const [key, value] of this.selectedPlayersGroup) {
            splitGeneral.push(value.length);
        }

        return splitProper.reduce((a, b) => a + b, 0) === splitGeneral.reduce((a, b) => a + b, 0);
    }

    checkNoOverlappingPlayers(): boolean {
        let selectedPlayers = [];

        for (const [key, playersArray] of this.selectedPlayersGroup) {
            for (const player of playersArray) {
                selectedPlayers.push(player.uuid);
            }
        }

        return new Set(selectedPlayers).size === selectedPlayers.length;
    }

    sendRecreateRoundRequest(): void {
        this.isLoading = true;

        let params = new HttpParams();

        for (let i = 1; i <= this.numberOfGroups; i++) {
            const currentGroupSelectedPlayers: Player[] = this.selectedPlayersGroup.get(i);
            let currentGroupSelectedPlayersUuids: string[] = [];
            for (const row of this.seasonScoreboard.seasonScoreboardRows) {
                const player: Player = row.player;
                if (currentGroupSelectedPlayers.filter(playerA => playerA.uuid == player.uuid).pop()) {
                    currentGroupSelectedPlayersUuids.push(player.uuid);
                }
            }
            params = params.append('playersUuids', currentGroupSelectedPlayersUuids.toString());
        }

        this.http
            .put<string>(this.apiEndpointsService.getRoundsWithUuid(this.roundUuid),
                {},
                {
                    params: params,
                })
            .subscribe(() => {
                this.router.navigate(['round', this.roundUuid]);
            });
    }

    getStarForPlayer(playerUuid: string): SeasonStar {
        return this.seasonScoreboard.seasonStars[playerUuid];
    }

    shouldBeChecked(row: SeasonScoreboardRow, number: number): boolean {
        let currentPlayer: Player = row.player;
        let players: Player[] = this.selectedPlayersGroup.get(number);
        let playerOrUndefined: Player = players.filter(player => player.uuid === currentPlayer.uuid).pop();
        return playerOrUndefined !== undefined;
    }

    private preselectPlayersBasedOnRound(): void {
        for (let group of this.roundScoreboard.roundGroupScoreboards) {
            let groupNumber: number = group.roundGroupNumber;
            for (let row of group.scoreboardRows) {
                let player: Player = row.player;
                this.selectedPlayersGroup.get(groupNumber).push(player);
            }
        }
    }

}
