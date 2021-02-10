import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DomSanitizer, SafeResourceUrl, Title} from '@angular/platform-browser';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {plainToClass} from 'class-transformer';
import {LeagueStats} from '../shared/rest-api-dto/league-stats.model';
import {Subject} from 'rxjs';
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-league-stats-view',
    templateUrl: './league-stats-view.component.html',
    styleUrls: ['./league-stats-view.component.css']
})
export class LeagueStatsViewComponent implements OnInit, OnDestroy {

    destroy$: Subject<boolean> = new Subject<boolean>();

    uuid: string;
    leagueStats: LeagueStats;

    constructor(private route: ActivatedRoute,
                private sanitizer: DomSanitizer,
                private http: HttpClient,
                private apiEndpointsService: ApiEndpointsService,
                private titleService: Title,
                private translateService: TranslateService) {

    }

    ngOnInit(): void {
        this.route.params.subscribe(params => this.uuid = params["uuid"]);
        this.http.get<LeagueStats>(this.apiEndpointsService.getLeagueStatsByUuid(this.uuid))
            .pipe(map(result => plainToClass(LeagueStats, result)))
            .subscribe(result => {
                this.leagueStats = result;
                this.translateService
                    .get('dynamicTitles.leagueStats', {leagueName: this.leagueStats.leagueName})
                    .subscribe((translation: string) => {
                        this.titleService.setTitle(translation);
                    });
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    sanitizeLogo(leagueDto: LeagueStats): SafeResourceUrl {
        let logo: string = leagueDto.logoSanitized();
        return this.sanitizer.bypassSecurityTrustResourceUrl(logo);
    }

}
