import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";
import {League} from "../shared/rest-api-dto/league.model";
import {map} from "rxjs/operators";
import {plainToInstance} from "class-transformer";
import {MyLoggerService} from "../shared/my-logger.service";
import {AuthService} from "../shared/auth.service";

@Component({
    selector: 'app-league-moderator-view',
    templateUrl: './league-moderator-view.component.html',
    styleUrls: ['./league-moderator-view.component.css']
})
export class LeagueModeratorViewComponent implements OnInit {

    availableTabs = [
        'players',
        'roles',
        'details'
    ];

    tab: string;
    selectedTabIndex = 0;

    uuid: string;
    league: League;
    isModerator: boolean;
    isOwner: boolean;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private http: HttpClient,
                private authService: AuthService,
                private loggerService: MyLoggerService,
                private apiEndpointsService: ApiEndpointsService,
                private titleService: Title,
                private translateService: TranslateService) {

    }

    setupComponent(leagueUuid: string) {
        this.uuid = leagueUuid;

        this.authService.hasRoleForLeague(leagueUuid, 'MODERATOR', false)
            .then((result) => {
                    this.isModerator = result;
                }
            );

        this.authService.hasRoleForLeague(leagueUuid, 'OWNER', false)
            .then((result) => {
                    this.isOwner = result;
                }
            );

        this.http
            .get<League>(this.apiEndpointsService.getLeagueGeneralInfoByUuid(this.uuid))
            .pipe(map((result) => plainToInstance(League, result)))
            .subscribe((result) => {
                this.league = result;

                this.translateService
                    .get('dynamicTitles.moderatingLeague',
                        {leagueName: this.league.leagueName}
                    )
                    .subscribe((res: string) => {
                        this.titleService.setTitle(res);
                        this.loggerService.log(res);
                    });
            });

    }

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            if (params.uuid !== this.uuid) {
                this.setupComponent(params.uuid);
            }
            this.tab = params['tab'];
            this.switchTab(this.availableTabs.indexOf(this.tab));
        });
    }

    updating(event: any): void {
        this.setupComponent(this.uuid);
    }

    switchTab(index: number): void {
        if (index === -1) {
            index = 0;
        }
        this.selectedTabIndex = index;
        this.router.navigate(['/league-moderating', this.uuid, this.availableTabs[index]]);
    }

}
