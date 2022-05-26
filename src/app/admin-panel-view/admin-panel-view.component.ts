import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";
import {League} from "../shared/rest-api-dto/league.model";
import {map} from "rxjs/operators";
import {plainToInstance} from "class-transformer";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {PlayerDetailed} from "../shared/rest-api-dto/player-detailed.model";
import {MyLoggerService} from "../shared/my-logger.service";
import {NotificationService} from "../shared/notification.service";

@Component({
    selector: 'app-admin-panel-view',
    templateUrl: './admin-panel-view.component.html',
    styleUrls: ['./admin-panel-view.component.css']
})
export class AdminPanelViewComponent implements OnInit {

    availableTabs = [
        'players',
        'leagues',
        'league-roles'
    ];

    tab: string;
    selectedTabIndex = 0;

    leagues: League[];
    logosMap: Map<string, string>;
    players: PlayerDetailed[];

    constructor(private apiEndpointsService: ApiEndpointsService,
                private http: HttpClient,
                private loggerService: MyLoggerService,
                private titleService: Title,
                private notificationService: NotificationService,
                private route: ActivatedRoute,
                private router: Router,
                private translateService: TranslateService) {
    }

    ngOnInit(): void {
        this.route
            .params
            .subscribe({
                next: (params) => {
                    this.tab = params['tab'];
                    this.switchTab(this.availableTabs.indexOf(this.tab));
                }
            });

        this.translateService
            .get('adminPanel.title')
            .subscribe({
                next: (translation) => {
                    this.titleService.setTitle(translation);
                    this.loggerService.log(translation);
                }
            });

        this.http
            .get<PlayerDetailed[]>(this.apiEndpointsService.getAllPlayers())
            .pipe(map((result) => plainToInstance(PlayerDetailed, result)))
            .subscribe({
                next: (result) => {
                    this.players = result;
                }
            });

        this.http
            .get<League[]>(this.apiEndpointsService.getAllLeaguesGeneralInfo())
            .pipe(map((result) => plainToInstance(League, result)))
            .subscribe({
                next: (result) => {
                    this.leagues = result;
                }
            });

        this.http
            .get(this.apiEndpointsService.getAllLeaguesLogos())
            .subscribe({
                next: (result) => {
                    this.logosMap = new Map<string, string>();
                    for (let item in result) {
                        this.logosMap.set(item, result[item]);
                    }
                }
            });
    }

    switchTab(index: number): void {
        if (index === -1) {
            index = 0;
        }
        this.selectedTabIndex = index;
        this.router.navigate(['/admin-panel', this.availableTabs[index]]);
    }

    evictWholeCache(): void {
        this.http
            .delete(this.apiEndpointsService.evictCacheAll())
            .subscribe({
                next: () => {
                    this.notificationService.success('Cache evicted successfully');
                },
                error: (error) => {
                    this.notificationService.error('Cache eviction error. ' + error);
                }
            });
    }

}
