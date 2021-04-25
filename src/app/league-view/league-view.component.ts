import {Component, OnInit} from '@angular/core';
import {LeagueStats} from "../shared/rest-api-dto/league-stats.model";
import {ActivatedRoute, Router} from "@angular/router";
import {DomSanitizer, Title} from "@angular/platform-browser";
import {HttpBackend, HttpClient} from "@angular/common/http";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {TranslateService} from "@ngx-translate/core";
import {map} from "rxjs/operators";
import {plainToClass} from "class-transformer";
import {LeagueRule} from "../shared/rest-api-dto/league-rule.model";
import {AuthService} from "../shared/auth.service";
import {MatTabChangeEvent} from "@angular/material/tabs";

@Component({
    selector: 'app-league-view',
    templateUrl: './league-view.component.html',
    styleUrls: ['./league-view.component.css']
})
export class LeagueViewComponent implements OnInit {

    uuid: string;
    tab: string;
    isModerator: boolean;
    leagueStats: LeagueStats;
    leagueRules: LeagueRule[];
    availableTabs = ['overal', 'seasons', 'trophies', 'scoreboard', 'rules'];
    selectedTabIndex = 0;

    constructor(private route: ActivatedRoute,
                private sanitizer: DomSanitizer,
                private http: HttpClient,
                private apiEndpointsService: ApiEndpointsService,
                private titleService: Title,
                private router: Router,
                private authService: AuthService,
                private translateService: TranslateService) {

    }

    ngOnInit(): void {
        this.route
            .params
            .subscribe(params => {
                this.uuid = params['uuid'];
                this.tab = params['tab'];
                this.switchTab(this.availableTabs.indexOf(this.tab));
            });

        this.http
            .get<LeagueStats>(this.apiEndpointsService.getLeagueStatsByUuid(this.uuid))
            .pipe(map(result => plainToClass(LeagueStats, result)))
            .subscribe(result => {
                this.leagueStats = result;
                this.translateService
                    .get('dynamicTitles.leagueStats', {leagueName: this.leagueStats.leagueName})
                    .subscribe((translation: string) => {
                        this.titleService.setTitle(translation);
                    });
                console.log(this.leagueStats);
            });

        this.http
            .get<LeagueRule[]>(this.apiEndpointsService.getLeagueRulesByUuid(this.uuid))
            .pipe(map(result => plainToClass(LeagueRule, result)))
            .subscribe(result => {
                this.leagueRules = result;
                console.log(this.leagueRules);
            });

        this.authService.hasRoleForLeague(this.uuid, 'MODERATOR')
            .then((data) => {
                this.isModerator = data;
            });
    }

    switchTab(index: number): void {
        if (index === -1) {
            index = 0;
        }
        this.selectedTabIndex = index;
        this.router.navigate(['/league', this.uuid, this.availableTabs[index]]);
    }

}
