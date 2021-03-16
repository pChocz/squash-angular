import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {RoundScoreboard} from '../shared/rest-api-dto/round-scoreboard.model';
import {plainToClass} from 'class-transformer';
import {map} from 'rxjs/operators';
import {DomSanitizer, Title} from '@angular/platform-browser';
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-round-view',
    templateUrl: './round-view.component.html',
    styleUrls: ['./round-view.component.css'],
})
export class RoundViewComponent implements OnInit {

    uuid: string;
    roundScoreboard: RoundScoreboard;
    leagueLogoBytes: string

    constructor(
        private route: ActivatedRoute,
        private http: HttpClient,
        private sanitizer: DomSanitizer,
        private apiEndpointsService: ApiEndpointsService,
        private titleService: Title,
        private translateService: TranslateService) {

    }

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            this.setupComponent(params.uuid);
        });
    }

    setupComponent(roundUuid: string) {
        this.roundScoreboard = null;
        this.uuid = roundUuid;

        this.http
            .get<RoundScoreboard>(this.apiEndpointsService.getRoundScoreboardByUuid(this.uuid))
            .pipe(map((result) => plainToClass(RoundScoreboard, result)))
            .subscribe((result) => {
                this.roundScoreboard = result;
                this.translateService
                    .get('dynamicTitles.round',
                        {
                            roundNumber: this.roundScoreboard.roundNumber,
                            seasonNumber: this.roundScoreboard.seasonNumberRoman,
                            leagueName: this.roundScoreboard.leagueName
                        }
                    )
                    .subscribe((res: string) => {
                        this.titleService.setTitle(res);
                    });
            });

        this.http
            .get(this.apiEndpointsService.getLeagueLogoByRoundUuid(this.uuid), {responseType: 'text'})
            .subscribe((result) => {
                this.leagueLogoBytes = result;
            });
    }

    printRound() {
        window.print();
    }

}
