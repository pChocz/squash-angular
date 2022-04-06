import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpClient, HttpParams} from "@angular/common/http";
import {MatDialog} from "@angular/material/dialog";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {map} from "rxjs/operators";
import {plainToInstance} from "class-transformer";
import {HeadToHeadScoreboard} from "../shared/rest-api-dto/head-to-head-scoreboard.model";
import {Title} from "@angular/platform-browser";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {MyLoggerService} from "../shared/my-logger.service";

@Component({
  selector: 'app-head-to-head-view',
  templateUrl: './head-to-head-view.component.html',
  styleUrls: ['./head-to-head-view.component.css']
})
export class HeadToHeadViewComponent implements OnInit {

  firstPlayerUuid: string;
  secondPlayerUuid: string;
  leagueUuid: string;

  scoreboard: HeadToHeadScoreboard;
  isLoading: boolean;
  includeAdditional: boolean;

  constructor(private route: ActivatedRoute,
              private loggerService: MyLoggerService,
              private http: HttpClient,
              private dialog: MatDialog,
              private titleService: Title,
              private apiEndpointsService: ApiEndpointsService) {

    this.isLoading = true;
    this.includeAdditional = true;
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
    this.scoreboard = null;

    const params = new HttpParams().set('includeAdditional', this.includeAdditional);

    this.http
    .get<HeadToHeadScoreboard>(this.apiEndpointsService.getHeadToHead(this.firstPlayerUuid, this.secondPlayerUuid), {params: params})
    .pipe(map((result) => plainToInstance(HeadToHeadScoreboard, result)))
    .subscribe((result) => {
      this.scoreboard = result;

      let title: string = this.scoreboard.matches.length === 0
          ? 'h2h'
          : 'h2h | ' + this.scoreboard.winner.player + ' v ' + this.scoreboard.looser.player;

      if (this.includeAdditional) {
        title += ' (+add)';
      }

      this.titleService.setTitle(title);
      this.loggerService.log(title)

      this.isLoading = false;
    });
  }
}
