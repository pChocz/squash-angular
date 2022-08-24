import {Component, OnInit} from '@angular/core';
import {MyLoggerService} from "../shared/my-logger.service";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {Title} from "@angular/platform-browser";
import {map} from "rxjs/operators";
import {plainToInstance} from "class-transformer";
import {SetResultsHistogram} from "../shared/rest-api-dto/set-results-histogram.model";

@Component({
    selector: 'app-league-set-results-histogram',
    templateUrl: './league-set-results-histogram.component.html',
    styleUrls: ['./league-set-results-histogram.component.css']
})
export class LeagueSetResultsHistogramComponent implements OnInit {

    leagueUuid: string;
    leagueLogoBytes: string;
    setResultsHistogram: SetResultsHistogram;
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
                    .get<SetResultsHistogram>(this.apiEndpointsService.getLeagueSetResultsHistogram(this.leagueUuid, true))
                    .pipe(map((result) => plainToInstance(SetResultsHistogram, result)))
                    .subscribe((result) => {
                        this.loading = false;
                        this.setResultsHistogram = result;

                        this.translateService
                            .get('stats.setResults.histogram')
                            .subscribe((translation: string) => {
                                let title: string = translation + " | " + this.setResultsHistogram.league.leagueName;
                                this.titleService.setTitle(title);
                                this.loggerService.log(title);
                            });
                    })
            })
    }

}


















