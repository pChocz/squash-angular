import {Component, OnInit} from '@angular/core';
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpClient, HttpParams} from "@angular/common/http";
import {LogAggregateByUser} from "../shared/rest-api-dto/log-aggregate-by-user.model";
import {map} from "rxjs/operators";
import {plainToInstance} from "class-transformer";
import {LogStats} from "../shared/rest-api-dto/log-stats.model";
import {LogEntriesPaginated} from "../shared/rest-api-dto/log-entries-paginated.model";
import {LogAggregateByMethod} from "../shared/rest-api-dto/log-aggregate-by-method.model";
import {LogBucket} from "../shared/rest-api-dto/log-bucket.model";
import {EChartsOption, number} from "echarts";
import {formatDate, formatNumber} from "@angular/common";
import {interval} from "rxjs";

@Component({
  selector: 'app-logs-view',
  templateUrl: './logs-view.component.html',
  styleUrls: ['./logs-view.component.css']
})
export class LogsViewComponent implements OnInit {

  static ONE_MINUTE_IN_MILLIS: number = 1000 * 60;
  static ONE_HOUR_IN_MILLIS: number = 1000 * 60 * 60;
  static ONE_DAY_IN_MILLIS: number = 1000 * 60 * 60 * 24;

  static ALL: string = 'ALL';
  static LAST_10_MINUTES: string = 'LAST_10_MINUTES';
  static LAST_1_HOUR: string = 'LAST_1_HOUR';
  static LAST_24_HOURS: string = 'LAST_24_HOURS';
  static LAST_7_DAYS: string = 'LAST_7_DAYS';

  bucketChartOptions: EChartsOption;
  selectedUser: string;
  selectedType: string;
  selectedRangeStart: Date;
  selectedRangeEnd: Date;
  selectedPredefinedRange: string;
  selectedBucketsCount: number;
  selectedMessageContains: string;
  selectedTimestampPer: string;

  logAggregateByUser: LogAggregateByUser[];
  logAggregateByMethod: LogAggregateByMethod[];
  logBuckets: LogBucket[];
  allLogStats: LogStats;
  filteredLogStats: LogStats;
  logEntriesPaginated: LogEntriesPaginated

  constructor(private apiEndpointsService: ApiEndpointsService,
              private snackBar: MatSnackBar,
              private http: HttpClient) {
    this.selectedUser = LogsViewComponent.ALL;
    this.selectedType = LogsViewComponent.ALL;
    this.selectedBucketsCount = 10;
    this.selectedTimestampPer = '1min';
    this.selectedPredefinedRange = LogsViewComponent.LAST_10_MINUTES;
    this.refreshQuery();
  }

  ngOnInit(): void {
    this.query();
  }

  query(): void {

    // bucket
    let params = new HttpParams();
    params = params.set("start", this.selectedRangeStart.toISOString());
    params = params.set("stop", this.selectedRangeEnd.toISOString());
    params = params.set("numberOfBuckets", this.selectedBucketsCount);
    if (this.selectedType !== LogsViewComponent.ALL) {
      params = params.set("type", this.selectedType);
    }
    if (this.selectedUser !== LogsViewComponent.ALL) {
      params = params.set("username", this.selectedUser);
    }
    if (this.selectedMessageContains) {
      params = params.set("messageContains", this.selectedMessageContains);
    }

    this.http
    .get<LogBucket[]>(this.apiEndpointsService.getLogBuckets(), {
      params: params
    })
    .pipe(map((result) => plainToInstance(LogBucket, result)))
    .subscribe((result) => {
      this.logBuckets = result;
      let newDataXY = this.logBuckets.map(o => [o.id, o.countSum]);
      let newDataY = this.logBuckets.map(o => o.countSum);

      const sum = newDataY.reduce((sum, current) => sum + current, 0);
      let hits = formatNumber(sum, 'pl');

      let start = formatDate(this.selectedRangeStart, 'medium', 'pl-PL');
      let end = formatDate(this.selectedRangeEnd, 'medium', 'pl-PL');

      let interval = 2 * (this.selectedRangeEnd.getTime() - this.selectedRangeStart.getTime()) / this.selectedBucketsCount;

      this.bucketChartOptions = {
        title: {
          text: `${hits} hits`,
          subtext: `${start} - ${end} @ timestamp per ${this.selectedTimestampPer}`,
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            let time = formatDate(params.value[0].getTime(), 'medium', 'pl-PL');
            let count = params.value[1];
            return `
                ${time} <br/>
                <b>${count}</b> hits
              `;
          }
        },
        yAxis: {
          type: 'value',
        },
        xAxis: {
          type: 'time',
          min: this.selectedRangeStart,
          minInterval: interval,
          maxInterval: interval,
        },
        series: {
          data: newDataXY,
          type: 'bar',
        }
      }
    });


    // aggregates

    this.http
    .get<LogAggregateByUser[]>(this.apiEndpointsService.getLogsAggregateByUser())
    .pipe(map((result) => plainToInstance(LogAggregateByUser, result)))
    .subscribe((result) => {
      this.logAggregateByUser = result;
    });

    this.http
    .get<LogAggregateByMethod[]>(this.apiEndpointsService.getLogsAggregateByMethod())
    .pipe(map((result) => plainToInstance(LogAggregateByMethod, result)))
    .subscribe((result) => {
      this.logAggregateByMethod = result;
    });

    this.http
    .get<LogStats>(this.apiEndpointsService.getLogsStats())
    .pipe(map((result) => plainToInstance(LogStats, result)))
    .subscribe((result) => {
      this.allLogStats = result;
    });


    // filtered

    this.http
    .get<LogStats>(this.apiEndpointsService.getLogsStats(), {
      params: params
    })
    .pipe(map((result) => plainToInstance(LogStats, result)))
    .subscribe((result) => {
      this.filteredLogStats = result;
    });

    this.http
    .get<LogEntriesPaginated>(this.apiEndpointsService.getLogsPaginated(), {
      params: params
    })
    .pipe(map((result) => plainToInstance(LogEntriesPaginated, result)))
    .subscribe((result) => {
      this.logEntriesPaginated = result;
    });
  }

  refreshQuery() {
    const now = new Date();
    const roundUpTo = roundTo => x => Math.ceil(x / roundTo) * roundTo;
    const roundUpTo1Minute = roundUpTo(LogsViewComponent.ONE_MINUTE_IN_MILLIS);
    const roundUpTo5Minutes = roundUpTo(5 * LogsViewComponent.ONE_MINUTE_IN_MILLIS);
    const roundUpTo1Hour = roundUpTo(LogsViewComponent.ONE_HOUR_IN_MILLIS);
    const roundUpTo1Day = roundUpTo(LogsViewComponent.ONE_DAY_IN_MILLIS);

    switch (this.selectedPredefinedRange) {
      case LogsViewComponent.LAST_10_MINUTES: {
        this.selectedBucketsCount = 10;
        this.selectedTimestampPer = '1min';
        this.selectedRangeEnd = new Date(roundUpTo1Minute(now));
        this.selectedRangeStart = new Date(this.selectedRangeEnd.getTime() - 10 * LogsViewComponent.ONE_MINUTE_IN_MILLIS);
        break;
      }
      case LogsViewComponent.LAST_1_HOUR: {
        this.selectedBucketsCount = 12;
        this.selectedTimestampPer = '5min';
        this.selectedRangeEnd = new Date(roundUpTo5Minutes(now));
        this.selectedRangeStart = new Date(this.selectedRangeEnd.getTime() - LogsViewComponent.ONE_HOUR_IN_MILLIS);
        break;
      }
      case LogsViewComponent.LAST_24_HOURS: {
        this.selectedBucketsCount = 24;
        this.selectedTimestampPer = 'hour';
        this.selectedRangeEnd = new Date(roundUpTo1Hour(now));
        this.selectedRangeStart = new Date(this.selectedRangeEnd.getTime() - LogsViewComponent.ONE_DAY_IN_MILLIS);
        break;
      }
      case LogsViewComponent.LAST_7_DAYS: {
        this.selectedBucketsCount = 7;
        this.selectedTimestampPer = 'day';
        this.selectedRangeEnd = new Date(roundUpTo1Day(now));
        this.selectedRangeStart = new Date(this.selectedRangeEnd.getTime() - 7 * LogsViewComponent.ONE_DAY_IN_MILLIS);
        break;
      }
    }

    this.query();
  }
}
