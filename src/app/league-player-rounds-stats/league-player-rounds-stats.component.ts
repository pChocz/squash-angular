import {Component, OnInit} from '@angular/core';
import {League} from "../shared/rest-api-dto/league.model";
import {Player} from "../shared/rest-api-dto/player.model";
import {MyLoggerService} from "../shared/my-logger.service";
import {TranslateService} from "@ngx-translate/core";
import {HttpClient} from "@angular/common/http";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {Title} from "@angular/platform-browser";
import {map} from "rxjs/operators";
import {plainToClass} from "class-transformer";
import {ActivatedRoute, Router} from "@angular/router";
import {PlayerAllRoundsStats} from "../shared/rest-api-dto/player-all-rounds-stats.model";
import {formatNumber, Location} from "@angular/common";
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

  // slider
  value: number;
  highValue: number;
  roundRangeSliderOptions: Options;

  // charts
  roundsHistoryChartOptions: EChartsOption;
  winningRoundsChartOptions: EChartsOption;
  placesHistogramOptions: EChartsOption;
  perGroupOccurrencesChartOptions: EChartsOption;

  leagueUuid: string;
  league: League;
  players: Player[];
  availableSeasonNumbers: number[];
  selectedPlayer: Player;
  stats: PlayerAllRoundsStats;

  isLoading: boolean;
  noStatsAvailable: boolean;

  constructor(private loggerService: MyLoggerService,
              private translateService: TranslateService,
              private router: Router,
              private location: Location,
              private route: ActivatedRoute,
              private http: HttpClient,
              private apiEndpointsService: ApiEndpointsService,
              private titleService: Title) {
  }

  ngOnInit(): void {
    this.route
    .params
    .subscribe((params) => {
      this.leagueUuid = params.uuid

      this.http
      .get<League>(this.apiEndpointsService.getLeagueGeneralInfoByUuid(this.leagueUuid))
      .pipe(map((result) => plainToClass(League, result)))
      .subscribe((result) => {
        this.league = result;

        this.http
        .get<Player[]>(this.apiEndpointsService.getLeaguePlayersByUuid(this.leagueUuid))
        .pipe(map((result) => plainToClass(Player, result)))
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
    this.isLoading = true;
    this.noStatsAvailable = false;

    this.http
    .get<PlayerAllRoundsStats>(this.apiEndpointsService.getPlayerRoundsStats(this.leagueUuid, selectedPlayer.uuid))
    .pipe(map((result) => plainToClass(PlayerAllRoundsStats, result)))
    .subscribe(
        result => {
          this.stats = result;

          if (this.stats.playerSingleRoundStats.length > 0) {
            this.setTitleLeagueAndPlayer();

            this.roundRangeSliderOptions = {
              floor: 1,
              ceil: this.stats.playerSingleRoundStats.length,
            };

            this.value = 1;
            this.highValue = this.stats.playerSingleRoundStats.length;

            this.recreateCharts();

          } else {
            this.noStatsAvailable = true;
          }
        },
        error => {
          console.log(error);
          this.noStatsAvailable = true;
        },
        () => {
          this.isLoading = false;
        });
  }

  private setTitleLeagueOnly() {
    this.translateService
    .get('stats.tabs.rounds')
    .subscribe((translation: string) => {
      let title: string = translation + " | " + this.league.leagueName;
      this.titleService.setTitle(title);
      this.titleService.setTitle(title);
      this.loggerService.log(title);
    });
  }

  private setTitleLeagueAndPlayer() {
    this.translateService
    .get('stats.tabs.rounds')
    .subscribe((translation: string) => {
      let title: string = translation + ' | ' + this.league.leagueName + ' | ' + this.selectedPlayer.username;
      this.titleService.setTitle(title);
      this.titleService.setTitle(title);
      this.loggerService.log(title);
    });
  }

  public recreateCharts() {
    let trimmedChartData: PlayerSingleRoundsStats[] = this
        .stats
        .playerSingleRoundStats
        .reverse()
        .slice(this.value, this.highValue);

    this.buildPerGroupOccurrencesChart(trimmedChartData);
    this.buildWinningRoundsChart(trimmedChartData);
    this.buildRoundsHistoryChart(trimmedChartData);
    this.buildPlacesHistogramChart(trimmedChartData);
  }

  private buildPerGroupOccurrencesChart(chartData: PlayerSingleRoundsStats[]) {
    let groupsData = chartData.map(p => p.roundGroupCharacter);
    let occurrencesPerGroup = LeaguePlayerRoundsStatsComponent.countOccurrences(groupsData);
    let occurrencesPerGroupCharacters: string[] = Object.keys(occurrencesPerGroup).map(String);
    let occurrencesPerGroupCounts: number[] = Object.values(occurrencesPerGroup).map(Number);
    let pieChartDto = this.buildPieChartDto(occurrencesPerGroupCharacters, occurrencesPerGroupCounts);

    this.perGroupOccurrencesChartOptions = {
      tooltip: {
      },
      title: {
        text: 'Group Presences',
        left: 'center'
      },
      series: [
        {
          name: 'Group counts',
          type: 'pie',
          radius: '50%',
          data: pieChartDto,
          label: {
            formatter: '{b}: {c} ({d}%)',
            position: 'outer',
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }

  private buildWinningRoundsChart(chartData: PlayerSingleRoundsStats[]) {
    let winningRoundsData = chartData
        .filter(p => p.row.placeInGroup === 1)
        .map(p => p.roundGroupCharacter);

    let occurrencesPerGroup = LeaguePlayerRoundsStatsComponent.countOccurrences(winningRoundsData);
    let occurrencesPerGroupCharacters: string[] = Object.keys(occurrencesPerGroup).map(String);
    let occurrencesPerGroupCounts: number[] = Object.values(occurrencesPerGroup).map(Number);
    let pieChartDto = this.buildPieChartDto(occurrencesPerGroupCharacters, occurrencesPerGroupCounts);

    this.winningRoundsChartOptions = {
      tooltip: {
      },
      title: {
        text: 'Group Wins',
        left: 'center'
      },
      series: [
        {
          name: 'Group wins counts',
          type: 'pie',
          radius: '50%',
          data: pieChartDto,
          label: {
            formatter: '{b}: {c} ({d}%)',
            position: 'outer',
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
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

    let roundsPlayed = chartData.length;
    let startDate = chartData[0].round.roundDate;
    let endDate = chartData[roundsPlayed - 1].round.roundDate;
    let roundPlaceAverage = chartData.map(p => p.row.placeInRound).reduce((a, b) => a+b, 0) / roundsPlayed;
    let groupPlaceAverage = chartData.map(p => p.row.placeInGroup).reduce((a, b) => a+b, 0) / roundsPlayed;

    let roundPlaceAverageRounded = formatNumber(roundPlaceAverage, 'pl', '1.1-1')
    let groupPlaceAverageRounded = formatNumber(groupPlaceAverage, 'pl', '1.1-1')

    let ralliesDiffData = chartData.map(p => p.row.pointsBalance);

    this.roundsHistoryChartOptions = {
      legend: {
      },
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
        name: `${roundsPlayed} rounds (${startDate} - ${endDate})`,
        nameLocation: 'middle',
        data: xValues,
        show: true
      },
      series: [
        {
          name: 'Place in round',
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
                  formatter: `Round: ${roundPlaceAverageRounded}`,
                },
                yAxis: roundPlaceAverage,
              },
              {
                label: {
                  position: 'insideEndTop',
                  formatter: `Group: ${groupPlaceAverageRounded}`,
                },
                yAxis: groupPlaceAverage,
              },
            ]
          }
        },
        {
          name: 'Place in group',
          data: placesInGroupData,
          yAxisIndex: 0,
          type: 'line',
        },
        {
          name: 'Rallies diff',
          data: ralliesDiffData,
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
    let allKeys = keysA.concat(keysB.filter((item) => keysA.indexOf(item) < 0)).sort((n1,n2) => n1 - n2);

    let min = 1;
    let max = allKeys[allKeys.length-1];

    let occurrences: number[] = [];
    let occurrencesRound: number[] = [];
    let occurrencesGroup: number[] = [];
    for (let i=min; i <= max; i++) {
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
      legend: {
      },
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
          name: 'Places in round',
          data: Object.values(occurrencesRound),
          yAxisIndex: 0,
          type: 'bar',
        },
        {
          name: 'Places in group',
          data: Object.values(occurrencesGroup),
          yAxisIndex: 0,
          type: 'bar',
        }
      ]
    };
  }

  private static countOccurrences(placesInRoundData: any[]) {
    return placesInRoundData.reduce(function (acc, curr) {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});
  }
}
