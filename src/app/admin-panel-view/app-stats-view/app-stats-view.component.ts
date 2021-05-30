import {Component, OnInit} from '@angular/core';
import {map} from "rxjs/operators";
import {plainToClass} from "class-transformer";
import {ApiEndpointsService} from "../../shared/api-endpoints.service";
import {HttpClient} from "@angular/common/http";
import {PlayerLogStats} from "../../shared/rest-api-dto/player-log-stats.model";
import {LogFilenameDate} from "../../shared/rest-api-dto/log-filename-date.model";

@Component({
  selector: 'app-app-stats-view',
  templateUrl: './app-stats-view.component.html',
  styleUrls: ['./app-stats-view.component.css']
})
export class AppStatsViewComponent implements OnInit {

  logFilesDates: LogFilenameDate[];
  selectedLogFileDate: LogFilenameDate;
  playerLogStats: PlayerLogStats[];

  constructor(private apiEndpointsService: ApiEndpointsService,
              private http: HttpClient) {
  }

  ngOnInit(): void {
    this.loadLogFileStats("out.log");

    this.http
    .get<LogFilenameDate[]>(this.apiEndpointsService.getLogFilesDates())
    .pipe(map((result) => plainToClass(LogFilenameDate, result)))
    .subscribe((result) => {
      this.logFilesDates = result;
      this.selectedLogFileDate = this.logFilesDates[0];
    });

  }

  dateSelect(value): void {
    this.loadLogFileStats(value.filename);
  }

  private loadLogFileStats(filename: string): void {
    this.http
    .get<PlayerLogStats[]>(this.apiEndpointsService.getPlayersLogStats(filename))
    .pipe(map((result) => plainToClass(PlayerLogStats, result)))
    .subscribe((result) => {
      this.playerLogStats = result;
    });
  }

}
