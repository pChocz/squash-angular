import { Component, OnInit } from '@angular/core';
import {MyLoggerService} from "../shared/my-logger.service";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {Title} from "@angular/platform-browser";
import {map} from "rxjs/operators";
import {plainToInstance} from "class-transformer";
import {LeagueMatchResultDistribution} from "../shared/rest-api-dto/league-match-result-distribution.model";

@Component({
  selector: 'app-league-match-results-distribution',
  templateUrl: './league-match-results-distribution.component.html',
  styleUrls: ['./league-match-results-distribution.component.css']
})
export class LeagueMatchResultsDistributionComponent implements OnInit {

  leagueUuid: string;
  leagueLogoBytes: string;
  leagueMatchResultDistribution: LeagueMatchResultDistribution;
  loading: boolean;

  constructor(private loggerService: MyLoggerService,
              private translateService: TranslateService,
              private router: Router,
              private location: Location,
              private route: ActivatedRoute,
              private http: HttpClient,
              private apiEndpointsService: ApiEndpointsService,
              private titleService: Title) {
    this.loading = true;

  }

  ngOnInit(): void {
    this.route
        .params
        .subscribe((params) => {
          this.leagueUuid = params.uuid

          this.http
              .get(this.apiEndpointsService.getLeagueLogo(this.leagueUuid), {responseType: 'text'})
              .subscribe((result) => {
                this.leagueLogoBytes = result;
              });

          this.http
              .get<LeagueMatchResultDistribution>(this.apiEndpointsService.getLeagueMatchResultsDistribution(this.leagueUuid))
              .pipe(map((result) => plainToInstance(LeagueMatchResultDistribution, result)))
              .subscribe((result) => {
                this.loading = false;
                this.leagueMatchResultDistribution = result;

                this.translateService
                    .get('stats.matchResults.distribution')
                    .subscribe((translation: string) => {
                      let title: string = translation + " | " + this.leagueMatchResultDistribution.league.leagueName;
                      this.titleService.setTitle(title);
                      this.loggerService.log(title);
                    });
              })
        })
  }


}
