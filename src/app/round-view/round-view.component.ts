import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
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
    tab: number;
    roundScoreboard: RoundScoreboard;
    leagueLogoBytes: string

    constructor(
        private route: ActivatedRoute,
        private http: HttpClient,
        private sanitizer: DomSanitizer,
        private apiEndpointsService: ApiEndpointsService,
        private router: Router,
        private titleService: Title,
        private translateService: TranslateService) {

    }

    ngOnInit(): void {
        this.route
            .params
            .subscribe((params) => {
                if (params.uuid !== this.uuid) {
                    this.setupComponent(params.uuid);
                }
                this.tab = params['tab'];
                this.switchTab(this.tab);
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

    switchTab(index: number): void {
        if (index === -1) {
            index = 0;
        }
        this.tab = index;
        this.router.navigate(['/round', this.uuid, this.tab]);
    }

}
