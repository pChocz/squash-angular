import {Component, OnInit} from '@angular/core';
import {League} from "../shared/rest-api-dto/league.model";
import {Player} from "../shared/rest-api-dto/player.model";
import {MyLoggerService} from "../shared/my-logger.service";
import {TranslateService} from "@ngx-translate/core";
import {HttpClient} from "@angular/common/http";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {Title} from "@angular/platform-browser";
import {map} from "rxjs/operators";
import {plainToInstance} from "class-transformer";
import {ActivatedRoute, Router} from "@angular/router";
import {PlayerAllRoundsStats} from "../shared/rest-api-dto/player-all-rounds-stats.model";
import {formatDate, formatNumber, Location} from "@angular/common";
import {EChartsOption} from "echarts";
import {PlayerSingleRoundsStats} from "../shared/rest-api-dto/player-single-rounds-stats.model";
import {Options} from "@angular-slider/ngx-slider";
import {PieChartGroups} from "./pie-chart-groups.model";

@Component({
    selector: 'app-league-player-rounds-stats',
    templateUrl: './league-player-rounds-stats.component.html',
    styleUrls: ['./league-player-rounds-stats.component.css']
})
export class LeaguePlayerRoundsStatsComponent implements OnInit {

    locale: string;

    // slider
    value: number;
    highValue: number;
    roundRangeSliderOptions: Options;

    // charts
    roundsHistoryChartOptions: EChartsOption;
    winningRoundsChartOptions: EChartsOption;
    placesHistogramOptions: EChartsOption;
    perGroupOccurrencesChartOptions: EChartsOption;
    colors = {
        'A': 'rgba(6,159,6,0.5)',
        'B': 'rgba(217,214,35,0.5)',
        'C': 'rgba(236,82,82,0.5)',
        'D': 'rgba(162,60,60,0.5)',
    }
    translatedLabels = {
        'groupPresences': '',
        'groupWins': '',
        'placeInRound': '',
        'placeInGroup': '',
        'placesInRound': '',
        'placesInGroup': '',
        'matchesRatio': '',
        'average': '',
        'rounds': '',
    }

    leagueUuid: string;
    league: League;
    leagueLogoBytes: string;
    players: Player[];
    availableSeasonNumbers: number[];
    selectedPlayer: Player;
    stats: PlayerAllRoundsStats;

    leagueLoading: boolean;
    statsLoading: boolean;
    noStatsAvailable: boolean;

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
                'charts.rounds.groupPresences', 'charts.rounds.groupWins',
                'charts.rounds.placeInRound', 'charts.rounds.placeInGroup',
                'charts.rounds.placesInRound', 'charts.rounds.placesInGroup',
                'charts.rounds.matchesRatio', 'charts.rounds.average',
                'round.genitive'
            ])
            .subscribe(data => {
                this.translatedLabels['groupPresences'] = data['charts.rounds.groupPresences'];
                this.translatedLabels['groupWins'] = data['charts.rounds.groupWins'];
                this.translatedLabels['placeInRound'] = data['charts.rounds.placeInRound'];
                this.translatedLabels['placeInGroup'] = data['charts.rounds.placeInGroup'];
                this.translatedLabels['placesInRound'] = data['charts.rounds.placesInRound'];
                this.translatedLabels['placesInGroup'] = data['charts.rounds.placesInGroup'];
                this.translatedLabels['matchesRatio'] = data['charts.rounds.matchesRatio'];
                this.translatedLabels['average'] = data['charts.rounds.average'];
                this.translatedLabels['rounds'] = data['round.genitive'];
            });
    }

    private static countOccurrences(placesInRoundData: any[]) {
        return placesInRoundData.reduce(function (acc, curr) {
            return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
        }, {});
    }

    ngOnInit(): void {
        this.route
            .params
            .subscribe({
                next: (params) => {
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
                                .subscribe({
                                    next: (result) => {
                                        this.players = result;

                                        this.route
                                            .queryParams
                                            .subscribe({
                                                next: (params) => {
                                                    if (params.player) {
                                                        this.selectedPlayer = this.players.filter(player => player.uuid === params.player).pop();
                                                        this.loadStatsForPlayer(this.selectedPlayer);

                                                    } else {
                                                        this.selectedPlayer = null;
                                                        this.stats = null;
                                                        this.setTitleLeagueOnly();
                                                    }
                                                }
                                            });
                                    }
                                });
                        });
                }
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
        this.statsLoading = true;
        this.noStatsAvailable = false;

        this.http
            .get<PlayerAllRoundsStats>(this.apiEndpointsService.getPlayerRoundsStats(this.leagueUuid, selectedPlayer.uuid))
            .pipe(map((result) => plainToInstance(PlayerAllRoundsStats, result)))
            .subscribe({
                next: (result) => {
                    this.stats = result;
                    let roundsPlayed = this.stats.playerSingleRoundStats.length;

                    if (roundsPlayed > 0) {
                        this.setTitleLeagueAndPlayer();

                        this.roundRangeSliderOptions = {
                            floor: 1,
                            ceil: roundsPlayed,
                        };

                        this.highValue = roundsPlayed;
                        this.value = 1;

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

    public recreateCharts() {
        let trimmedChartData: PlayerSingleRoundsStats[] = this
            .stats
            .playerSingleRoundStats
            .slice(this.value - 1, this.highValue);

        this.buildPerGroupOccurrencesChart(trimmedChartData);
        this.buildWinningRoundsChart(trimmedChartData);
        this.buildRoundsHistoryChart(trimmedChartData);
        this.buildPlacesHistogramChart(trimmedChartData);
    }

    private setTitleLeagueOnly() {
        this.translateService
            .get('stats.tabs.rounds')
            .subscribe({
                next: (translation: string) => {
                    let title: string = translation + " | " + this.league.leagueName;
                    this.titleService.setTitle(title);
                    this.loggerService.log(title);
                }
            });
    }

    private setTitleLeagueAndPlayer() {
        this.translateService
            .get('stats.tabs.rounds')
            .subscribe({
                next: (translation: string) => {
                    let title: string = translation + ' | ' + this.league.leagueName + ' | ' + this.selectedPlayer.username;
                    this.titleService.setTitle(title);
                    this.titleService.setTitle(title);
                    this.loggerService.log(title);
                }
            });
    }

    private buildPerGroupOccurrencesChart(chartData: PlayerSingleRoundsStats[]) {
        let groupsData = chartData.map(p => p.roundGroupCharacter);
        let occurrencesPerGroup = LeaguePlayerRoundsStatsComponent.countOccurrences(groupsData);
        let occurrencesPerGroupCharacters: string[] = Object.keys(occurrencesPerGroup).map(String);
        let occurrencesPerGroupCounts: number[] = Object.values(occurrencesPerGroup).map(Number);
        let pieChartDto = this.buildPieChartDto(occurrencesPerGroupCharacters, occurrencesPerGroupCounts);

        this.perGroupOccurrencesChartOptions = {
            tooltip: {},
            title: {
                text: `${this.translatedLabels['groupPresences']}`,
                left: 'center'
            },
            series: [
                {
                    name: `${this.translatedLabels['groupPresences']}`,
                    type: 'pie',
                    radius: '50%',
                    data: pieChartDto,
                    label: {
                        formatter: '{b}: {c} ({d}%)',
                        position: 'outer',
                    },
                    itemStyle: {
                        color: seriesIndex => this.colors[seriesIndex.name],
                    },
                }
            ]
        };
    }

    private buildWinningRoundsChart(chartData: PlayerSingleRoundsStats[]) {
        let groupsData = chartData
            .map(p => p.roundGroupCharacter);

        let winningRoundsData = chartData
            .filter(p => p.row.placeInGroup === 1)
            .map(p => p.roundGroupCharacter);

        let winningsPerGroup = LeaguePlayerRoundsStatsComponent.countOccurrences(groupsData);
        let occurrencesPerGroup = LeaguePlayerRoundsStatsComponent.countOccurrences(winningRoundsData);
        let occurrencesPerGroupCharacters: string[] = Object.keys(occurrencesPerGroup).map(String);
        let occurrencesPerGroupCounts: number[] = Object.values(occurrencesPerGroup).map(Number);
        let pieChartDto = this.buildPieChartDto(occurrencesPerGroupCharacters, occurrencesPerGroupCounts);

        this.winningRoundsChartOptions = {
            tooltip: {},
            title: {
                text: `${this.translatedLabels['groupWins']}`,
                left: 'center'
            },
            series: [
                {
                    name: `${this.translatedLabels['groupWins']}`,
                    type: 'pie',
                    radius: '50%',
                    data: pieChartDto,
                    label: {
                        formatter: function (params) {
                            let group = params.name;
                            let wins: number = Number(params.value);
                            let occurrences = winningsPerGroup[group];
                            let percent = (100 * wins / occurrences).toLocaleString('en', {maximumFractionDigits: 2});
                            return `${group}: ${wins} (${percent}%)`;
                        },
                        position: 'outer',
                    },
                    itemStyle: {
                        color: seriesIndex => this.colors[seriesIndex.name],
                    },
                }
            ]
        };
    }

    private buildPieChartDto(occurrencesPerGroupCharacters: string[], occurrencesPerGroupCounts: number[]) {
        let pieChartObjects: PieChartGroups[] = []
        for (let i = 0; i < occurrencesPerGroupCharacters.length; i++) {
            pieChartObjects.push(new PieChartGroups(occurrencesPerGroupCounts[i], occurrencesPerGroupCharacters[i]))
        }
        pieChartObjects.sort((a, b) => a.name.localeCompare(b.name));
        return pieChartObjects;
    }

    private buildRoundsHistoryChart(chartData: PlayerSingleRoundsStats[]) {
        let xValues = chartData.map(p => {
            return 'R ' + p.round.roundNumber + ', S ' + p.seasonNumber + ' (' + p.round.roundDate.toString() + ')';
        });

        let placesInGroupData = chartData.map(p => p.row.placeInGroup);
        let placesInRoundData = chartData.map(p => p.row.placeInRound);
        let matchesRatioData = chartData.map(p => {
            let won = p.row.matchesWon;
            let lost = p.row.matchesLost;
            return Math.round(10 * 100 * won / (won + lost)) / 10;
        });

        let roundsPlayed = chartData.length;
        let startDate = formatDate(chartData[0].round.roundDate, 'mediumDate', this.locale);
        let endDate = formatDate(chartData[roundsPlayed - 1].round.roundDate, 'mediumDate', this.locale);
        let roundPlaceAverage = chartData.map(p => p.row.placeInRound).reduce((a, b) => a + b, 0) / roundsPlayed;
        let groupPlaceAverage = chartData.map(p => p.row.placeInGroup).reduce((a, b) => a + b, 0) / roundsPlayed;

        let roundPlaceAverageRounded = formatNumber(roundPlaceAverage, this.locale, '1.1-1')
        let groupPlaceAverageRounded = formatNumber(groupPlaceAverage, this.locale, '1.1-1')

        this.roundsHistoryChartOptions = {
            legend: {},
            tooltip: {
                trigger: 'axis',
            },
            yAxis: [
                {
                    type: 'value',
                    inverse: true,
                    min: 1,
                    interval: 1,
                },
                {
                    type: 'value',
                    splitLine: {
                        show: false,
                    },
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
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                name: `${roundsPlayed} ${this.translatedLabels['rounds']} (${startDate} - ${endDate})`,
                nameLocation: 'middle',
                data: xValues,
                show: true
            },
            series: [
                {
                    name: `${this.translatedLabels['placeInRound']}`,
                    data: placesInRoundData,
                    yAxisIndex: 0,
                    type: 'line',
                    markLine: {
                        symbol: ['none', 'none'],
                        animation: false,
                        data: [
                            {
                                label: {
                                    position: 'insideStartTop',
                                    formatter: `${this.translatedLabels['average']}: ${roundPlaceAverageRounded}`,
                                },
                                yAxis: roundPlaceAverage,
                            },
                        ]
                    }
                },
                {
                    name: `${this.translatedLabels['placeInGroup']}`,
                    data: placesInGroupData,
                    yAxisIndex: 0,
                    type: 'line',
                    markLine: {
                        symbol: ['none', 'none'],
                        animation: false,
                        data: [
                            {
                                label: {
                                    position: 'insideEndTop',
                                    formatter: `${this.translatedLabels['average']}: ${groupPlaceAverageRounded}`,
                                },
                                yAxis: groupPlaceAverage,
                            },
                        ]
                    }
                },
                {
                    name: `${this.translatedLabels['matchesRatio']}`,
                    data: matchesRatioData,
                    yAxisIndex: 1,
                    type: 'bar',
                },
            ]
        };
    }

    private buildPlacesHistogramChart(chartData: PlayerSingleRoundsStats[]) {
        let placesInGroupData = chartData.map(p => p.row.placeInGroup);
        let placesInRoundData = chartData.map(p => p.row.placeInRound);
        let occurrencesPlacesInRound = LeaguePlayerRoundsStatsComponent.countOccurrences(placesInRoundData);
        let occurrencesPlacesInGroup = LeaguePlayerRoundsStatsComponent.countOccurrences(placesInGroupData);
        let keysA = Object.keys(occurrencesPlacesInRound).map(Number);
        let keysB = Object.keys(occurrencesPlacesInGroup).map(Number);
        let allKeys = keysA.concat(keysB.filter((item) => keysA.indexOf(item) < 0)).sort((n1, n2) => n1 - n2);

        let min = 1;
        let max = allKeys[allKeys.length - 1];

        let occurrences: number[] = [];
        let occurrencesRound: number[] = [];
        let occurrencesGroup: number[] = [];
        for (let i = min; i <= max; i++) {
            let round = occurrencesPlacesInRound[i];
            let group = occurrencesPlacesInGroup[i];
            occurrences.push(i);
            if (round) {
                occurrencesRound.push(round);
            } else {
                occurrencesRound.push(0);
            }
            if (group) {
                occurrencesGroup.push(group);
            } else {
                occurrencesGroup.push(0);
            }
        }

        this.placesHistogramOptions = {
            legend: {},
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                },
            },
            yAxis: [
                {
                    type: 'value',
                    minInterval: 1,
                },
            ],
            xAxis: {
                type: 'category',
                data: occurrences,
            },
            series: [
                {
                    name: `${this.translatedLabels['placesInRound']}`,
                    data: Object.values(occurrencesRound),
                    yAxisIndex: 0,
                    type: 'bar',
                    label: {
                        show: true,
                        position: "top",
                        formatter: function (params) {
                            let total = chartData.length;
                            let current: number = Number(params.value);
                            if (current === 0) {
                                return ``;
                            } else {
                                let percent = (100 * current / total).toLocaleString('en', {maximumFractionDigits: 0});
                                return `${percent}%`;
                            }
                        },
                    },
                },
                {
                    name: `${this.translatedLabels['placesInGroup']}`,
                    data: Object.values(occurrencesGroup),
                    yAxisIndex: 0,
                    type: 'bar',
                    label: {
                        show: true,
                        position: "top",
                        formatter: function (params) {
                            let total = chartData.length;
                            let current: number = Number(params.value);
                            if (current === 0) {
                                return ``;
                            } else {
                                let percent = (100 * current / total).toLocaleString('en', {maximumFractionDigits: 0});
                                return `${percent}%`;
                            }
                        },
                    },
                }
            ]
        };
    }
}
