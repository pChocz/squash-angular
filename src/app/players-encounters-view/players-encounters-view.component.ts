import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MyLoggerService} from "../shared/my-logger.service";
import {HttpClient} from "@angular/common/http";
import {MatDialog} from "@angular/material/dialog";
import {Title} from "@angular/platform-browser";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {map} from "rxjs/operators";
import {plainToInstance} from "class-transformer";
import {PlayersEncountersStats} from "../shared/rest-api-dto/players-encounters-stats.model";
import {TranslateService} from "@ngx-translate/core";
import {Options} from "@angular-slider/ngx-slider";
import {PlayersEncountersStatsResults} from "../shared/rest-api-dto/players-encounters-stats-results.model";
import {EChartsOption} from "echarts";
import {PlayersEncounter} from "../shared/rest-api-dto/players-encounter.model";

@Component({
    selector: 'app-players-encounters-view',
    templateUrl: './players-encounters-view.component.html',
    styleUrls: ['./players-encounters-view.component.css']
})
export class PlayersEncountersViewComponent implements OnInit {

    // slider
    value: number;
    highValue: number;
    roundRangeSliderOptions: Options;

    // chart
    winningsChartOption: EChartsOption;

    firstPlayerUuid: string;
    secondPlayerUuid: string;
    stats: PlayersEncountersStats;
    filteredStatsResults: PlayersEncountersStatsResults
    isLoading: boolean;

    constructor(private route: ActivatedRoute,
                private translateService: TranslateService,
                private loggerService: MyLoggerService,
                private http: HttpClient,
                private dialog: MatDialog,
                private titleService: Title,
                private apiEndpointsService: ApiEndpointsService) {

        this.isLoading = true;
    }

    ngOnInit(): void {
        this.route
            .params
            .subscribe(params => {
                this.firstPlayerUuid = params['firstPlayerUuid'];
                this.secondPlayerUuid = params['secondPlayerUuid'];
            });
        this.updateStats();
    }

    updateStats(): void {
        this.isLoading = true;
        this.stats = null;
        this.http
            .get<PlayersEncountersStats>(this.apiEndpointsService.getPlayersEncounters(this.firstPlayerUuid, this.secondPlayerUuid))
            .pipe(map((result) => plainToInstance(PlayersEncountersStats, result)))
            .subscribe((result) => {
                this.stats = result;
                this.filteredStatsResults = new PlayersEncountersStatsResults();
                this.filteredStatsResults.build(this.stats.playersEncounters, this.stats.firstPlayer, this.stats.secondPlayer);

                this.translateService
                    .get('stats.playersEncounters.title')
                    .subscribe({
                        next: (translation: string) => {
                            let title: string = this.stats.playersEncounters.length === 0
                                ? translation
                                : translation + ' | ' + this.stats.firstPlayer + ' v ' + this.stats.secondPlayer;
                            this.titleService.setTitle(title);
                            this.loggerService.log(title);
                        }
                    });

                this.isLoading = false;

                let roundsPlayed = this.stats.playersEncounters.length;
                this.roundRangeSliderOptions = {
                    floor: 1,
                    ceil: roundsPlayed,
                };

                this.value = 1;
                this.highValue = roundsPlayed;

                if (this.stats.playersEncounters.length > 0) {
                    this.recreateStats();
                }
            });
    }

    public recreateStats() {
        let filteredPlayersEncounters = this
            .stats
            .playersEncounters
            .slice(this.value - 1, this.highValue);
        this.filteredStatsResults = new PlayersEncountersStatsResults();
        this.filteredStatsResults.build(filteredPlayersEncounters, this.stats.firstPlayer, this.stats.secondPlayer);
        this.buildEncountersTimeline(filteredPlayersEncounters);
    }

    private buildEncountersTimeline(chartData: PlayersEncounter[]) {
        let winnings: number[] = [];
        winnings.push(0);
        if (chartData[0].winner.uuid === this.stats.firstPlayer.uuid) {
            winnings.push(1);
        } else {
            winnings.push(-1);
        }

        for (let i = 1; i < chartData.length; i++) {
            if (chartData[i].winner.uuid === this.stats.firstPlayer.uuid) {
                winnings.push(winnings[i] + 1);
            } else {
                winnings.push(winnings[i] - 1);
            }
        }

        this.winningsChartOption = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'none',
                },
            },
            yAxis: [
                {
                    type: 'value',
                    animation: false,
                    splitLine: {
                        show: true,
                    },
                    axisTick: {
                        show: false,
                    },
                    show: false,
                },
                {
                    type: 'value',
                    animation: false,
                    splitLine: {
                        show: true,
                    },
                    name: `← ${this.stats.firstPlayer.username} | ${this.stats.secondPlayer.username} →`,
                    nameLocation: 'middle',
                    nameRotate: -90,
                },
            ],
            xAxis: {
                axisLine: {
                    show: true,
                },
                type: 'category',
                show: true,
                axisTick: {
                    show: false,
                },

            },
            series: [
                {
                    data: winnings,
                    animation: false,
                    yAxisIndex: 0,
                    type: 'line',
                    showSymbol: false,
                    label: {
                      show: false,
                    },
                }
            ]
        };
    }
}
