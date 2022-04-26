import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DomSanitizer, Title} from "@angular/platform-browser";
import {HttpClient} from "@angular/common/http";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {TranslateService} from "@ngx-translate/core";
import {map} from "rxjs/operators";
import {plainToInstance} from "class-transformer";
import {LeagueRule} from "../shared/rest-api-dto/league-rule.model";
import {AuthService} from "../shared/auth.service";
import {LeagueOveralStats} from "../shared/rest-api-dto/league-overal-stats.model";
import {LeagueDetailedStats} from "../shared/rest-api-dto/league-detailed-stats.model";
import {SeasonTrophies} from "../shared/rest-api-dto/season-trophies.model";
import {MyLoggerService} from "../shared/my-logger.service";
import {League} from "../shared/rest-api-dto/league.model";
import {Season} from "../shared/rest-api-dto/season.model";

@Component({
    selector: 'app-league-view',
    templateUrl: './league-view.component.html',
    styleUrls: ['./league-view.component.css']
})
export class LeagueViewComponent implements OnInit {

    uuid: string;
    tab: string;
    isModerator: boolean;
    isOwner: boolean;
    leagueDetailedStats: LeagueDetailedStats;
    leagueOveralStats: LeagueOveralStats;
    seasonTrophies: SeasonTrophies[];
    leagueRules: LeagueRule[];
    leagueLogoBytes: string;
    league: League;
    seasons: Season[];

    availableTabs = ['overal', 'seasons', 'trophies', 'scoreboard', 'rules'];
    selectedTabIndex = 0;

    constructor(private route: ActivatedRoute,
                private sanitizer: DomSanitizer,
                private http: HttpClient,
                private apiEndpointsService: ApiEndpointsService,
                private titleService: Title,
                private router: Router,
                private loggerService: MyLoggerService,
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
            .get<LeagueOveralStats>(this.apiEndpointsService.getLeagueOveralStatsByUuid(this.uuid))
            .pipe(map(result => plainToInstance(LeagueOveralStats, result)))
            .subscribe(result => {
                this.leagueOveralStats = result;
                this.translateService
                    .get('dynamicTitles.leagueStats', {leagueName: this.leagueOveralStats.leagueName})
                    .subscribe((translation: string) => {
                        this.titleService.setTitle(translation);
                        this.loggerService.log(translation);
                    });
                this.loadDetailedData();
            });
    }

    switchTab(index: number): void {
        if (index === -1) {
            index = 0;
        }
        this.selectedTabIndex = index;
        this.router.navigate(['/league', this.uuid, this.availableTabs[index]]);
    }

    private loadDetailedData(): void {
        this.http
            .get<SeasonTrophies[]>(this.apiEndpointsService.getSeasonTrophiesForLeagueByUuid(this.uuid))
            .pipe(map(result => plainToInstance(SeasonTrophies, result)))
            .subscribe(result => {
                this.seasonTrophies = result;
            });

        this.http
            .get<League>(this.apiEndpointsService.getLeagueGeneralInfoByUuid(this.uuid))
            .pipe(map((result) => plainToInstance(League, result)))
            .subscribe((result) => {
                this.league = result;
                this.seasons = result.seasons.reverse();
            });

        this.http
            .get<LeagueDetailedStats>(this.apiEndpointsService.getLeagueStatsByUuid(this.uuid))
            .pipe(map(result => plainToInstance(LeagueDetailedStats, result)))
            .subscribe(result => {
                this.leagueDetailedStats = result;
            });

        this.http
            .get<LeagueRule[]>(this.apiEndpointsService.getLeagueRulesForLeague(this.uuid))
            .pipe(map(result => plainToInstance(LeagueRule, result)))
            .subscribe(result => {
                this.leagueRules = result;
            });

        this.http
            .get(this.apiEndpointsService.getLeagueLogo(this.uuid), {responseType: 'text'})
            .subscribe((result) => {
                this.leagueLogoBytes = result;
            });

        this.authService.hasRoleForLeague(this.uuid, 'MODERATOR', false)
            .then((data) => {
                this.isModerator = data;
            });

        this.authService.hasRoleForLeague(this.uuid, 'OWNER', false)
            .then((data) => {
                this.isOwner = data;
            });
    }

}
