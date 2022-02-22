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
import {Location} from "@angular/common";
import {EChartsOption} from "echarts";
import {PlayerSingleRoundsStats} from "../shared/rest-api-dto/player-single-rounds-stats.model";

@Component({
  selector: 'app-league-player-rounds-stats',
  templateUrl: './league-player-rounds-stats.component.html',
  styleUrls: ['./league-player-rounds-stats.component.css']
})
export class LeaguePlayerRoundsStatsComponent implements OnInit {

  primaryChartOptions: EChartsOption;
  secondaryChartOptions: EChartsOption;

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
          this.buildChart(this.stats.playerSingleRoundStats.reverse());
          if (this.stats.playerSingleRoundStats.length > 0) {
            this.setTitleLeagueAndPlayer();
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

  private buildChart(chartData: PlayerSingleRoundsStats[]) {
    let xValues = chartData.map(p => {
      return 'R ' + p.round.roundNumber + ', S ' + p.seasonNumber + ' (' + p.round.roundDate.toString() + ')';
    });

    let placesInRoundData = chartData.map(p => p.row.placeInRound);
    let placesInGroupData = chartData.map(p => p.row.placeInGroup);
    let ralliesDiffData = chartData.map(p => p.row.pointsBalance);

    this.primaryChartOptions = {
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
        data: xValues,
        show: false
      },
      series: [
          {
            name: 'Place in round',
            data: placesInRoundData,
            yAxisIndex: 0,
            type: 'line',
          },
        {
          name: 'Place in group',
          data: placesInGroupData,
          yAxisIndex: 0,
          type: 'line',
        },
          {
            name: 'Points diff',
            data: ralliesDiffData,
            yAxisIndex: 1,
            type: 'bar',
          },
      ]
    };


    let occurrencesPlacesInRound = LeaguePlayerRoundsStatsComponent.countOccurrences(placesInRoundData);
    let occurrencesPlacesInGroup = LeaguePlayerRoundsStatsComponent.countOccurrences(placesInGroupData);
    let data = [Object.keys(occurrencesPlacesInRound).map(Number), Object.values(occurrencesPlacesInRound).map(Number)]
    let keysA = Object.keys(occurrencesPlacesInRound).map(Number);
    let keysB = Object.keys(occurrencesPlacesInGroup).map(Number);
    let allKeys = keysA.concat(keysB.filter((item) => keysA.indexOf(item) < 0)).sort((n1,n2) => n1 - n2);

    let min = allKeys[0];
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

    // console.log(occurrencesPlacesInRound);
    // console.log(occurrencesPlacesInGroup);
    // console.log(data);
    // console.log(keysA);
    // console.log(keysB);
    // console.log(allKeys);
    // console.log(occurrencesRound);
    // console.log(occurrencesGroup);

    this.secondaryChartOptions = {
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

  private static countOccurrences(placesInRoundData: number[]) {
    return placesInRoundData.reduce(function (acc, curr) {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});
  }
}
