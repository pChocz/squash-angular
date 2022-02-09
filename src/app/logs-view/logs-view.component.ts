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

@Component({
  selector: 'app-logs-view',
  templateUrl: './logs-view.component.html',
  styleUrls: ['./logs-view.component.css']
})
export class LogsViewComponent implements OnInit {

  selectedUser: string;
  selectedType: string;
  selectedRangeStart: Date;
  selectedRangeEnd: Date;
  selectedBucketsCount: number;

  logAggregateByUser: LogAggregateByUser[];
  logAggregateByMethod: LogAggregateByMethod[];
  logBuckets: LogBucket[];
  allLogStats: LogStats;
  filteredLogStats: LogStats;
  logEntriesPaginated: LogEntriesPaginated

  constructor(private apiEndpointsService: ApiEndpointsService,
              private snackBar: MatSnackBar,
              private http: HttpClient) {
    this.selectedUser = null;
    this.selectedType = null;
    this.selectedRangeEnd = new Date();
    this.selectedRangeStart = new Date(this.selectedRangeEnd.getTime() - 15 * 60 * 1000);
    this.selectedBucketsCount = 10;
  }

  ngOnInit(): void {
    this.query();
  }

  query(): void {

    // bucket
    let bucketParams = new HttpParams();
    bucketParams = bucketParams.set("start", this.selectedRangeStart.toISOString());
    bucketParams = bucketParams.set("end", this.selectedRangeEnd.toISOString());
    bucketParams = bucketParams.set("numberOfBuckets", 10);
    if (this.selectedType) {
      bucketParams = bucketParams.set("type", this.selectedType);
    }
    if (this.selectedUser) {
      bucketParams = bucketParams.set("username", this.selectedUser);
    }

    this.http
    .get<LogBucket[]>(this.apiEndpointsService.getLogBuckets(), {
      params: bucketParams
    })
    .pipe(map((result) => plainToInstance(LogBucket, result)))
    .subscribe((result) => {
      this.logBuckets = result;
      console.log(this.logBuckets);
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

    let params = new HttpParams();
    params = params.set("start", this.selectedRangeStart.toISOString());
    params = params.set("end", this.selectedRangeEnd.toISOString());
    if (this.selectedType) {
      params = params.set("type", this.selectedType);
    }
    if (this.selectedUser) {
      params = params.set("username", this.selectedUser);
    }

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
      console.log(this.logEntriesPaginated);
    });

  }

  setRangesLast(number: number, unit: string) {
    this.selectedRangeEnd = new Date();

    if (unit === 'MINUTES') {
      this.selectedRangeStart = new Date(this.selectedRangeEnd.getTime() - number * 60 * 1000);

    } else if (unit === 'HOURS') {
      this.selectedRangeStart = new Date(this.selectedRangeEnd.getTime() - number * 60 * 60 * 1000);

    } else if (unit === 'DAYS') {
      this.selectedRangeStart = new Date(this.selectedRangeEnd.getTime() - number * 24 * 60 * 60 * 1000);
    }

    this.query();
  }
}
