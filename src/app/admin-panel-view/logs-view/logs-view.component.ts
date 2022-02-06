import {Component, OnInit} from '@angular/core';
import {ApiEndpointsService} from "../../shared/api-endpoints.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpClient, HttpParams} from "@angular/common/http";
import {LogAggregateByUser} from "../../shared/rest-api-dto/log-aggregate-by-user.model";
import {map} from "rxjs/operators";
import {plainToInstance} from "class-transformer";
import {LogStats} from "../../shared/rest-api-dto/log-stats.model";
import {LogEntriesPaginated} from "../../shared/rest-api-dto/log-entries-paginated.model";
import {LogAggregateByMethod} from "../../shared/rest-api-dto/log-aggregate-by-method.model";

@Component({
  selector: 'app-logs-view',
  templateUrl: './logs-view.component.html',
  styleUrls: ['./logs-view.component.css']
})
export class LogsViewComponent implements OnInit {

  logAggregateByUser: LogAggregateByUser[];
  logAggregateByMethod: LogAggregateByMethod[];
  allLogStats: LogStats;
  filteredLogStats: LogStats;
  logEntriesPaginated: LogEntriesPaginated

  constructor(private apiEndpointsService: ApiEndpointsService,
              private snackBar: MatSnackBar,
              private http: HttpClient) {

  }

  ngOnInit(): void {

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
    params = params.set("username", "Maniak");
    params = params.set("type", "CONTROLLER");

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

}
