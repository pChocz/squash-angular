import {Component, OnInit} from '@angular/core';
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpClient, HttpParams} from "@angular/common/http";
import {map} from "rxjs/operators";
import {plainToInstance} from "class-transformer";
import {EChartsOption} from "echarts";
import {formatDate, formatNumber} from "@angular/common";
import {LogSummary} from "../shared/rest-api-dto/log-summary.model";

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
  static TODAY: string = 'TODAY';

  bucketChartOptions: EChartsOption;
  userSplitChartOptions: EChartsOption;
  methodSplitChartOptions: EChartsOption;
  splitChartHeight: number;

  selectedUser: string;
  selectedType: string;
  selectedRangeStart: Date;
  selectedRangeEnd: Date;
  selectedPredefinedRange: string;
  selectedBucketsCount: number;
  selectedMessageContains: string;
  selectedExceptionsOnly: boolean;
  selectedTimestampPer: string;
  selectedParams: HttpParams;

  isInitialLoading: boolean;
  noDataPresent: boolean;

  logSummary: LogSummary;
  allDaysWithLogs: Date[];

  constructor(private apiEndpointsService: ApiEndpointsService,
              private snackBar: MatSnackBar,
              private http: HttpClient) {
    this.isInitialLoading = true;
    this.selectedUser = LogsViewComponent.ALL;
    this.selectedType = LogsViewComponent.ALL;
    this.selectedPredefinedRange = LogsViewComponent.TODAY;
    this.refreshQuery();
  }

  ngOnInit(): void {
    this.query();
  }

  prepareQueryParams(): void {
    this.selectedParams = new HttpParams();
    this.selectedParams = this.selectedParams.set("start", this.selectedRangeStart.toISOString());
    this.selectedParams = this.selectedParams.set("stop", this.selectedRangeEnd.toISOString());
    this.selectedParams = this.selectedParams.set("numberOfBuckets", this.selectedBucketsCount);
    if (this.selectedType !== LogsViewComponent.ALL) {
      this.selectedParams = this.selectedParams.set("type", this.selectedType);
    }
    if (this.selectedUser !== LogsViewComponent.ALL) {
      this.selectedParams = this.selectedParams.set("username", this.selectedUser);
    }
    if (this.selectedMessageContains) {
      this.selectedParams = this.selectedParams.set("messageContains", this.selectedMessageContains);
    }
    if (this.selectedExceptionsOnly) {
      this.selectedParams = this.selectedParams.set("isException", this.selectedExceptionsOnly);
    }
  }

  query(): void {
    this.prepareQueryParams();

    this.http
    .get<LogSummary>(this.apiEndpointsService.getLogSummary(), {
      params: this.selectedParams
    })
    .pipe(map((result) => plainToInstance(LogSummary, result)))
    .subscribe((result) => {
      this.logSummary = result;

      this.isInitialLoading = false;

      this.allDaysWithLogs = this.datesBetween(this.logSummary.allLogsStats.minDateTime, this.logSummary.allLogsStats.maxDateTime);

      let bucketsXY = this.logSummary.logBuckets.map(o => [o.id, o.countSum]);
      let bucketsY = this.logSummary.logBuckets.map(o => o.countSum);

      const totalHits = bucketsY.reduce((sum, current) => sum + current, 0);
      this.noDataPresent = (totalHits === 0);

      let hits = formatNumber(totalHits, 'pl');

      let start = formatDate(this.selectedRangeStart, 'medium', 'pl-PL');
      let end = formatDate(this.selectedRangeEnd, 'medium', 'pl-PL');

      // let interval = 2 * (this.selectedRangeEnd.getTime() - this.selectedRangeStart.getTime()) / this.selectedBucketsCount;

      let usersXY = this.logSummary.filteredLogsAggregateByUser
          .sort((n1,n2) => n2.countSum - n1.countSum)
          .map(o => [o.username, o.countSum]);

      let methodsYX = this.logSummary.filteredLogsAggregateByMethod
          .sort((n1,n2) => n1.countSum - n2.countSum)
          .map(o => [o.countSum, o.methodName]);

      const methodsCount = this.logSummary.filteredLogsAggregateByMethod.length;
      if (methodsCount > 10) {
        this.splitChartHeight = 50 + 25 * this.logSummary.filteredLogsAggregateByMethod.length;
      } else {
        this.splitChartHeight = 400;
      }

      this.methodSplitChartOptions = {
        title: {
          text: `Methods`,
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
        },
        yAxis: {
          type: 'category',
          axisLabel: {
            interval: 0,
          },
        },
        xAxis: {
          type: 'value',
        },
        grid: {
          containLabel: true,
        },
        series: {
          data: methodsYX,
          type: 'bar',
          label: {
            show: true,
            position: 'right'
          },
        }
      }

      this.userSplitChartOptions = {
        title: {
          text: `Users`,
          left: 'center',
        },
        yAxis: {
          type: 'value',
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            interval: 0,
          },
        },
        series: {
          data: usersXY,
          type: 'bar',
          label: {
            show: true,
            position: 'top'
          },
        }
      }

      this.bucketChartOptions = {
        title: {
          text: `${hits} hits`,
          subtext: `${start} - ${end}`,
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
          name: 'Count',
          nameLocation: 'middle',
          nameTextStyle: {
            fontSize: 20,
          },
          nameGap: 30,
        },
        xAxis: {
          type: 'time',
          name: `@ timestamp per ${this.selectedTimestampPer}`,
          nameLocation: 'middle',
          nameGap: 30,
          min: this.selectedRangeStart,
          // minInterval: interval,
          // maxInterval: interval,
        },
        series: {
          data: bucketsXY,
          type: 'bar',
        }
      }
    });

  }

  refreshQuery() {
    const now = new Date();
    const roundUpTo = roundTo => x => Math.ceil(x / roundTo) * roundTo;
    const roundUpTo1Minute = roundUpTo(LogsViewComponent.ONE_MINUTE_IN_MILLIS);
    const roundUpTo5Minutes = roundUpTo(5 * LogsViewComponent.ONE_MINUTE_IN_MILLIS);
    const roundUpTo1Hour = roundUpTo(LogsViewComponent.ONE_HOUR_IN_MILLIS);
    const roundUpTo1Day = roundUpTo(LogsViewComponent.ONE_DAY_IN_MILLIS);

    if (Date.parse(this.selectedPredefinedRange)) {
      const selectedDate: Date = new Date(this.selectedPredefinedRange);
      this.selectedBucketsCount = 24;
      this.selectedTimestampPer = 'hour';
      this.selectedRangeStart = new Date();
      this.selectedRangeStart.setDate(selectedDate.getDate());
      this.selectedRangeStart.setHours(0,0,0,0);
      this.selectedRangeEnd = new Date();
      this.selectedRangeEnd.setDate(selectedDate.getDate());
      this.selectedRangeEnd.setHours(24,0,0,0);
      this.query();
      return;
    }

    switch (this.selectedPredefinedRange) {
      case LogsViewComponent.TODAY: {
        this.selectedBucketsCount = 24;
        this.selectedTimestampPer = 'hour';
        this.selectedRangeStart = new Date();
        this.selectedRangeStart.setHours(0,0,0,0);
        this.selectedRangeEnd = new Date();
        this.selectedRangeEnd.setHours(24,0,0,0);
        break;
      }
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

  datesBetween (startDate: Date, endDate: Date): Date[] {
    const dates: Date[] = [];
    let currentDate: Date = startDate;
    const addDays = function (days) {
      const date: Date = new Date(this.valueOf());
      date.setHours(0,0,0,0);
      date.setDate(date.getDate() + days);
      return date;
    }
    while (currentDate <= endDate) {
      dates.push(currentDate);
      currentDate = addDays.call(currentDate, 1);
    }
    return dates.reverse();
  }

}
