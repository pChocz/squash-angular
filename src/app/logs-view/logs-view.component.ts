import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpClient, HttpParams} from "@angular/common/http";
import {debounceTime, map} from "rxjs/operators";
import {plainToInstance} from "class-transformer";
import {EChartsOption} from "echarts";
import {formatDate, formatNumber} from "@angular/common";
import {LogSummary} from "../shared/rest-api-dto/log-summary.model";
import {TranslateService} from "@ngx-translate/core";
import {Subject, Subscription} from "rxjs";
import {Title} from "@angular/platform-browser";
import {MyLoggerService} from "../shared/my-logger.service";

@Component({
    selector: 'app-logs-view',
    templateUrl: './logs-view.component.html',
    styleUrls: ['./logs-view.component.css']
})
export class LogsViewComponent implements OnInit, OnDestroy {

    static ONE_MINUTE_IN_MILLIS: number = 1000 * 60;
    static ONE_HOUR_IN_MILLIS: number = 1000 * 60 * 60;
    static ONE_DAY_IN_MILLIS: number = 1000 * 60 * 60 * 24;

    static ALL: string = 'ALL';
    static LAST_10_MINUTES: string = 'LAST_10_MINUTES';
    static LAST_1_HOUR: string = 'LAST_1_HOUR';
    static LAST_24_HOURS: string = 'LAST_24_HOURS';
    static LAST_7_DAYS: string = 'LAST_7_DAYS';
    static TODAY: string = 'TODAY';
    locale: string;
    bucketChartOptions: EChartsOption;
    userSplitChartOptions: EChartsOption;
    methodSplitChartOptions: EChartsOption;
    splitChartHeight: number;
    selectedUser: string;
    selectedType: string;
    selectedRange: string;
    selectedRangeStart: Date;
    selectedRangeEnd: Date;
    selectedPredefinedRange: string;
    selectedBucketsCount: number;
    selectedMessageContains: string;
    selectedExceptionsOnly: boolean;
    selectedTimestampPer: string;
    selectedParams: HttpParams;
    isInitialLoading: boolean;
    isLoading: boolean;
    noDataPresent: boolean;
    logSummary: LogSummary;
    allDaysWithLogs: Date[];
    private inputChangedSubject: Subject<any> = new Subject<any>();
    private subscription: Subscription;

    constructor(private apiEndpointsService: ApiEndpointsService,
                private translateService: TranslateService,
                private titleService: Title,
                private loggerService: MyLoggerService,
                private snackBar: MatSnackBar,
                private http: HttpClient) {

        this.translateService
            .get('logs.title')
            .subscribe((res: string) => {
                this.titleService.setTitle(res);
                this.loggerService.log(res);
            });

        this.subscription = this.inputChangedSubject
            .pipe(debounceTime(500))
            .subscribe(() => this.refreshQuery());
        this.isInitialLoading = true;
        this.selectedUser = LogsViewComponent.ALL;
        this.selectedType = LogsViewComponent.ALL;
        this.selectedRange = 'PREDEFINED';
        this.selectedPredefinedRange = LogsViewComponent.TODAY;
        this.locale = this.translateService.currentLang;
        this.refreshQuery();
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    inputChanged() {
        this.inputChangedSubject.next('ignore');
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
                this.isLoading = false;
                this.allDaysWithLogs = this.datesBetween(this.logSummary.allLogsStats.minDateTime, this.logSummary.allLogsStats.maxDateTime);

                if (this.logSummary.logBuckets) {
                    this.initializeLogBucketChart();
                }

                if (this.logSummary.filteredLogsAggregateByUser) {
                    this.initializeUsersSplitChart();
                }

                if (this.logSummary.filteredLogsAggregateByMethod) {
                    this.initializeMethodsSplitChart();
                }
            });
    }

    clearFilters() {
        this.selectedExceptionsOnly = false;
        this.selectedUser = LogsViewComponent.ALL;
        this.selectedType = LogsViewComponent.ALL;
        this.selectedMessageContains = '';
        this.refreshQuery();
    }

    refreshQuery() {
        this.isLoading = true;
        const now = new Date();
        const roundUpTo = roundTo => x => Math.ceil(x / roundTo) * roundTo;
        const roundUpTo1Minute = roundUpTo(LogsViewComponent.ONE_MINUTE_IN_MILLIS);
        const roundUpTo5Minutes = roundUpTo(5 * LogsViewComponent.ONE_MINUTE_IN_MILLIS);
        const roundUpTo1Hour = roundUpTo(LogsViewComponent.ONE_HOUR_IN_MILLIS);
        const roundUpTo1Day = roundUpTo(LogsViewComponent.ONE_DAY_IN_MILLIS);

        if (this.selectedRange === 'CUSTOM') {
            if (this.selectedRangeStart > this.selectedRangeEnd) {
                this.snackBar.open("Choose valid range", 'X', {
                    duration: 7 * 1000,
                    panelClass: ['mat-toolbar', 'mat-warn'],
                });

            } else {
                this.selectedBucketsCount = 20;
                this.query();
            }

            return;
        }

        if (Date.parse(this.selectedPredefinedRange)) {
            const selectedDate: Date = new Date(this.selectedPredefinedRange);
            this.selectedBucketsCount = 24;
            this.selectedTimestampPer = 'hour';
            this.selectedRangeStart = new Date(selectedDate);
            this.selectedRangeEnd = new Date(selectedDate);
            this.selectedRangeEnd.setHours(24, 0, 0, 0);

            this.query();
            return;
        }

        switch (this.selectedPredefinedRange) {
            case LogsViewComponent.TODAY: {
                this.selectedBucketsCount = 24;
                this.selectedTimestampPer = 'hour';
                this.selectedRangeStart = new Date();
                this.selectedRangeStart.setHours(0, 0, 0, 0);
                this.selectedRangeEnd = new Date();
                this.selectedRangeEnd.setHours(24, 0, 0, 0);
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

    datesBetween(startDate: Date, endDate: Date): Date[] {
        const dates: Date[] = [];
        let currentDate: Date = startDate;
        const addDays = function (days) {
            const date: Date = new Date(this.valueOf());
            date.setHours(0, 0, 0, 0);
            date.setDate(date.getDate() + days);
            return date;
        }
        while (currentDate <= endDate) {
            dates.push(currentDate);
            currentDate = addDays.call(currentDate, 1);
        }
        return dates.reverse();
    }

    private initializeLogBucketChart() {
        let bucketsXY = this.logSummary.logBuckets.map(o => [o.id, o.countSum]);
        let bucketsY = this.logSummary.logBuckets.map(o => o.countSum);

        const totalHits = bucketsY.reduce((sum, current) => sum + current, 0);
        this.noDataPresent = (totalHits === 0);
        let hits = formatNumber(totalHits, this.locale);

        let start = formatDate(this.selectedRangeStart, 'medium', this.locale);
        let end = formatDate(this.selectedRangeEnd, 'medium', this.locale);

        let timestampInfo: string;
        if (this.selectedRange === 'PREDEFINED') {
            timestampInfo = this.selectedBucketsCount + ' @ timestamp per ' + this.selectedTimestampPer;
        } else {
            let first = this.logSummary.logBuckets[0].id.getTime();
            let second = this.logSummary.logBuckets[1].id.getTime();
            let minutesBetween = (second - first) / 60000;
            timestampInfo = this.selectedBucketsCount + ' @ timestamp per ' + minutesBetween + 'min';
        }

        let locale = this.locale;

        this.bucketChartOptions = {
            title: {
                text: `${hits} hits`,
                subtext: `${start} - ${end}`,
                left: 'center',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                },
                formatter: function (params) {
                    let time = formatDate(params[0].value[0].getTime(), 'medium', locale);
                    let count = formatNumber(params[0].value[1], locale);
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
                name: `${timestampInfo}`,
                nameLocation: 'middle',
                nameGap: 30,
                min: bucketsXY[0][0],
                // minInterval: interval,
                // maxInterval: interval,
            },
            series: {
                data: bucketsXY,
                type: 'bar',
            }
        }

    }

    private initializeUsersSplitChart() {
        const logAggregateByUsers = this.logSummary.filteredLogsAggregateByUser
            .sort((n1, n2) => n1.countSum - n2.countSum);

        let usernames = logAggregateByUsers.map(o => o.username);
        let counts = logAggregateByUsers.map(o => o.countSum);
        let queries = logAggregateByUsers.map(o => o.queryCountSum);
        let durationSum = logAggregateByUsers.map(o => o.durationSum);

        this.userSplitChartOptions = {
            legend: {
                selectorPosition: 'end',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                },
            },
            yAxis: {
                type: 'category',
                data: usernames,
                axisLabel: {
                    interval: 0,
                },
            },
            xAxis: [
                {
                    name: 'time',
                    nameLocation: 'middle',
                    nameGap: 30,
                    type: 'value',
                },
                {
                    name: 'queries',
                    nameLocation: 'middle',
                    nameGap: 30,
                    type: 'value',
                },
            ],
            grid: {
                containLabel: true,
            },
            series: [
                {
                    name: 'Count',
                    data: counts,
                    xAxisIndex: 1,
                    type: 'bar',
                },
                {
                    name: 'Queries',
                    data: queries,
                    xAxisIndex: 1,
                    type: 'bar',
                },
                {
                    name: 'Duration Sum',
                    data: durationSum,
                    xAxisIndex: 0,
                    type: 'bar',
                },
            ]
        };
    }

    private initializeMethodsSplitChart() {
        const logAggregateByMethods = this.logSummary.filteredLogsAggregateByMethod
            .sort((n1, n2) => n1.durationAvg - n2.durationAvg);

        let methodsNames = logAggregateByMethods.map(o => o.methodName);
        let methodsCounts = logAggregateByMethods.map(o => o.countSum);
        let methodsQueries = logAggregateByMethods.map(o => o.queryCountSum);
        let methodsDurationAverage = logAggregateByMethods.map(o => Math.round(o.durationAvg));
        let methodsDurationSum = logAggregateByMethods.map(o => o.durationSum);

        const methodsCount = this.logSummary.filteredLogsAggregateByMethod.length;
        if (methodsCount > 10) {
            this.splitChartHeight = 50 + 25 * this.logSummary.filteredLogsAggregateByMethod.length;
        } else {
            this.splitChartHeight = 400;
        }

        this.methodSplitChartOptions = {
            legend: {
                selectorPosition: 'end',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                },
            },
            yAxis: {
                type: 'category',
                data: methodsNames,
                axisLabel: {
                    interval: 0,
                },
            },
            xAxis: [
                {
                    name: 'time',
                    nameLocation: 'middle',
                    nameGap: 30,
                    type: 'value',
                },
                {
                    name: 'queries',
                    nameLocation: 'middle',
                    nameGap: 30,
                    type: 'value',
                },
            ],
            grid: {
                containLabel: true,
            },
            series: [
                {
                    name: 'Count',
                    data: methodsCounts,
                    xAxisIndex: 1,
                    type: 'bar',
                },
                {
                    name: 'Queries',
                    data: methodsQueries,
                    xAxisIndex: 1,
                    type: 'bar',
                },
                {
                    name: 'Duration Avg',
                    data: methodsDurationAverage,
                    xAxisIndex: 0,
                    type: 'bar',
                },
                {
                    name: 'Duration Sum',
                    data: methodsDurationSum,
                    xAxisIndex: 0,
                    type: 'bar',
                },
            ]
        };
    }

}
