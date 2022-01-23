import {Component, OnInit} from '@angular/core';
import {map} from "rxjs/operators";
import {plainToClass} from "class-transformer";
import {ApiEndpointsService} from "../../shared/api-endpoints.service";
import {HttpClient} from "@angular/common/http";
import {PlayerLogStats} from "../../shared/rest-api-dto/player-log-stats.model";
import {LogFilenameDate} from "../../shared/rest-api-dto/log-filename-date.model";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-app-stats-view',
  templateUrl: './app-stats-view.component.html',
  styleUrls: ['./app-stats-view.component.css']
})
export class AppStatsViewComponent implements OnInit {

  logFilesDates: LogFilenameDate[];
  selectedLogFileDate: LogFilenameDate;
  playerLogStats: PlayerLogStats[];
  frontendLogsOnly: boolean;

  constructor(private apiEndpointsService: ApiEndpointsService,
              private snackBar: MatSnackBar,
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

  evictWholeCache(): void {
    this.http
    .delete(this.apiEndpointsService.evictCacheAll())
    .subscribe(
        () => {
          this.snackBar.open('Cache evicted successfully', 'X', {
            duration: 7 * 1000,
            panelClass: ['mat-toolbar', 'mat-primary'],
          });
        },
        () => {
          this.snackBar.open('Cache eviction error', 'X', {
            duration: 7 * 1000,
            panelClass: ['mat-toolbar', 'mat-warn'],
          });
        });
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
