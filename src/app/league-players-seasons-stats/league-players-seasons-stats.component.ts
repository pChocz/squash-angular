import {Component, OnInit} from '@angular/core';
import {League} from "../shared/rest-api-dto/league.model";
import {Player} from "../shared/rest-api-dto/player.model";
import {MyLoggerService} from "../shared/my-logger.service";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {formatNumber, Location} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {Title} from "@angular/platform-browser";
import {map} from "rxjs/operators";
import {plainToInstance} from "class-transformer";
import {PlayerAllSeasonsStats} from "../shared/rest-api-dto/player-all-seasons-stats.model";
import {SeasonTrophies} from "../shared/rest-api-dto/season-trophies.model";
import {EChartsOption} from "echarts";

@Component({
    selector: 'app-league-players-seasons-stats',
    templateUrl: './league-players-seasons-stats.component.html',
    styleUrls: ['./league-players-seasons-stats.component.css']
})
export class LeaguePlayersSeasonsStatsComponent implements OnInit {

    locale: string;

    leagueUuid: string;
    league: League;
    leagueLogoBytes: string;
    players: Player[];

    selectedPlayer: Player;
    stats: PlayerAllSeasonsStats;
    otherTrophies: SeasonTrophies[];

    leagueLoading: boolean;
    statsLoading: boolean;
    noStatsAvailable: boolean;

    // charts
    seasonsHistoryChartOptions: EChartsOption;

    translatedLabels = {
        'placeInSeason': '',
        'matchesRatio': '',
        'average': '',
        'attendicesRatio': '',
    }


    constructor(private loggerService: MyLoggerService,
                private translateService: TranslateService,
                private router: Router,
                private location: Location,
                private route: ActivatedRoute,
                private http: HttpClient,
                private apiEndpointsService: ApiEndpointsService,
                private titleService: Title) {
        this.leagueLoading = true;
        this.locale = this.translateService.currentLang;

        this.translateService
            .get([
                'charts.seasons.placeInSeason',
                'charts.seasons.matchesRatio',
                'charts.seasons.average',
                'charts.seasons.attendicesRatio'
            ])
            .subscribe(data => {
                this.translatedLabels['placeInSeason'] = data['charts.seasons.placeInSeason'];
                this.translatedLabels['matchesRatio'] = data['charts.seasons.matchesRatio'];
                this.translatedLabels['average'] = data['charts.seasons.average'];
                this.translatedLabels['attendicesRatio'] = data['charts.seasons.attendicesRatio'];
            });
    }

    ngOnInit(): void {
        this.route
            .params
            .subscribe((params) => {
                this.leagueUuid = params.uuid

                this.http
                    .get(this.apiEndpointsService.getLeagueLogo(this.leagueUuid), {responseType: 'text'})
                    .subscribe((result) => {
                        this.leagueLogoBytes = result;
                    });

                this.http
                    .get<League>(this.apiEndpointsService.getLeagueGeneralInfoByUuid(this.leagueUuid))
                    .pipe(map((result) => plainToInstance(League, result)))
                    .subscribe((result) => {
                        this.league = result;
                        this.leagueLoading = false;

                        this.http
                            .get<Player[]>(this.apiEndpointsService.getLeaguePlayersByUuid(this.leagueUuid))
                            .pipe(map((result) => plainToInstance(Player, result)))
                            .subscribe((result) => {
                                this.players = result;

                                this.route
                                    .queryParams
                                    .subscribe((params) => {
                                        if (params.player) {
                                            this.selectedPlayer = this.players.filter(player => player.uuid === params.player).pop();
                                            this.loadStatsForPlayer(this.selectedPlayer);

                                        } else {
                                            this.selectedPlayer = null;
                                            this.stats = null;
                                            this.setTitleLeagueOnly();
                                        }
                                    });
                            });
                    });
            })
    }


    buildUrlStringAndGo(selectedPlayer: Player) {
        let params = {
            player: selectedPlayer.uuid
        }
        const url = this.router.createUrlTree(
            [],
            {
                relativeTo: this.route,
                queryParams: params,
                queryParamsHandling: 'merge'
            })
            .toString()
        this.location.go(url);
    }

    loadStatsForPlayerAndGo(selectedPlayer: Player) {
        this.buildUrlStringAndGo(selectedPlayer);
        this.loadStatsForPlayer(selectedPlayer);
    }

    loadStatsForPlayer(selectedPlayer: Player) {
        this.stats = null;
        this.otherTrophies = null;
        this.statsLoading = true;
        this.noStatsAvailable = false;

        this.http
            .get<PlayerAllSeasonsStats>(this.apiEndpointsService.getPlayerSeasonsStats(this.leagueUuid, selectedPlayer.uuid))
            .pipe(map((result) => plainToInstance(PlayerAllSeasonsStats, result)))
            .subscribe({
                next: (result) => {
                    this.stats = result;
                    this.otherTrophies = this.buildOtherTrophies();
                    let seasonsPlayed = this.stats.playerSingleSeasonStats.length;
                    if (seasonsPlayed > 0) {
                        this.setTitleLeagueAndPlayer();
                        this.recreateCharts();
                    } else {
                        this.noStatsAvailable = true;
                    }
                },
                error: () => {
                    this.noStatsAvailable = true;
                },
                complete: () => {
                    this.statsLoading = false;
                }
            });
    }

    buildOtherTrophies(): SeasonTrophies[] {
        let scoreboardsSeasonNumbers: number[] = this.stats.playerSingleSeasonStats.map(row => row.season.seasonNumber);
        let otherSeasonTrophies: SeasonTrophies[] = [];

        for (let seasonTrophy of this.stats.seasonTrophies) {
            if (!scoreboardsSeasonNumbers.includes(seasonTrophy.seasonNumber)) {
                otherSeasonTrophies.push(seasonTrophy);
            }
        }

        return otherSeasonTrophies;
    }

    public recreateCharts() {
        this.buildSeasonsHistoryChart();
    }

    private setTitleLeagueOnly() {
        this.translateService
            .get('stats.tabs.seasons')
            .subscribe((translation: string) => {
                let title: string = translation + " | " + this.league.leagueName;
                this.titleService.setTitle(title);
                this.loggerService.log(title);
            });
    }

    private setTitleLeagueAndPlayer() {
        this.translateService
            .get('stats.tabs.seasons')
            .subscribe((translation: string) => {
                let title: string = translation + ' | ' + this.league.leagueName + ' | ' + this.selectedPlayer.username;
                this.titleService.setTitle(title);
                this.titleService.setTitle(title);
                this.loggerService.log(title);
            });
    }

    private buildSeasonsHistoryChart() {
        let playerSingleSeasonStats = this.stats.playerSingleSeasonStats;

        let xValues = playerSingleSeasonStats.map(row => row.season.seasonNumberRoman);
        let placesInSeasonsData = playerSingleSeasonStats.map(row => row.placeInSeason);
        let attendicesInSeasonsData = playerSingleSeasonStats.map(row => {
            let present = row.seasonScoreboardRow.attendices;
            let all = row.season.allRounds;
            return Math.round(10 * 100 * present / all) / 10;
        });
        let matchesRatioInSeasonsData = playerSingleSeasonStats.map(row => {
            let won = row.seasonScoreboardRow.matchesWon;
            let lost = row.seasonScoreboardRow.matchesLost;
            return Math.round(10 * 100 * won / (won + lost)) / 10;
        });

        let seasonsPlayed = playerSingleSeasonStats.length;
        let seasonPlaceAverage = placesInSeasonsData.reduce((a, b) => a + b, 0) / seasonsPlayed;

        let seasonPlaceAverageRounded = formatNumber(seasonPlaceAverage, this.locale, '1.1-1')

        this.seasonsHistoryChartOptions = {
            legend: {},
            tooltip: {
                trigger: 'axis',
            },
            yAxis: [
                {
                    type: 'value',
                    inverse: true,
                    splitLine: {
                        show: false,
                    },
                    show: false,
                    min: 1,
                    interval: 1,
                },
                {
                    type: 'value',
                    inverse: false,
                    min: 0,
                    max: 100,
                    name: '%',
                    nameLocation: 'middle',
                    nameRotate: 180,
                },
            ],
            xAxis: {
                type: 'category',
                axisLine: {
                    show: false,
                },
                axisLabel: {
                    show: true,
                },
                axisTick: {
                    show: false,
                },
                data: xValues,
                show: true
            },
            series: [
                {
                    name: `${this.translatedLabels['placeInSeason']}`,
                    data: placesInSeasonsData,
                    yAxisIndex: 0,
                    type: 'line',
                    label: {
                        show: true,
                    },
                    markLine: {
                        symbol: ['none', 'none'],
                        animation: false,
                        data: [
                            {
                                label: {
                                    position: 'insideStartTop',
                                    formatter: `${this.translatedLabels['average']}: ${seasonPlaceAverageRounded}`,
                                },
                                yAxis: seasonPlaceAverage,
                            },
                        ]
                    }
                },
                {
                    name: `${this.translatedLabels['matchesRatio']}`,
                    data: matchesRatioInSeasonsData,
                    yAxisIndex: 1,
                    type: 'bar',
                    barWidth: '30%',
                },
                {
                    name: `${this.translatedLabels['attendicesRatio']}`,
                    data: attendicesInSeasonsData,
                    yAxisIndex: 1,
                    type: 'bar',
                    barGap: '5%',
                    barWidth: '5%',
                },
            ]
        };
    }

    hasAnyTrophies(): boolean {
        if (this.otherTrophies) {
            return this
                .otherTrophies
                .map(v => v.trophies)
                .reduce((a, b) => a + b.length, 0) > 0;
        }
        return false;
    }

    getNonEmptyTrophies(): SeasonTrophies[] {
        return this
            .otherTrophies
            .filter(trophy => trophy.trophies.length > 0);
    }
}
