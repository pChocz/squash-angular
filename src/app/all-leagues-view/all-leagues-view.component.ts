import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DomSanitizer, SafeResourceUrl, Title} from '@angular/platform-browser';
import {HttpClient} from '@angular/common/http';
import {League} from '../shared/rest-api-dto/league.model';
import {map} from 'rxjs/operators';
import {plainToClass} from 'class-transformer';
import {environment} from 'src/environments/environment';
import {formatDate} from '@angular/common';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ApiEndpointsService} from "../shared/api-endpoints.service";

@Component({
    selector: 'app-all-leagues-view',
    templateUrl: './all-leagues-view.component.html',
    styleUrls: ['./all-leagues-view.component.css'],
})
export class AllLeaguesViewComponent implements OnInit, AfterViewInit {
    leagues: League[];
    logosMap: Map<string, string>;
    selectedLeagueUuid: string;

    constructor(public sanitizer: DomSanitizer,
                private apiEndpointsService: ApiEndpointsService,
                private http: HttpClient,
                private titleService: Title,
                private route: ActivatedRoute,
                private router: Router) {

    }

    ngOnInit(): void {
        this.titleService.setTitle('All leagues');

        this.route.queryParams.subscribe((params) => {
            this.selectedLeagueUuid = params.expand;
        });

        this.http
            .get<League[]>(this.apiEndpointsService.getAllLeaguesGeneralInfo())
            .pipe(map((result) => plainToClass(League, result)))
            .subscribe((result) => {
                this.leagues = result;
            });

        this.http
            .get(this.apiEndpointsService.getAllLeaguesLogos())
            .subscribe((result) => {
                this.logosMap = new Map<string, string>();
                for (let item in result) {
                    this.logosMap.set(item, result[item]);
                }
            });
    }

    ngAfterViewInit(): void {
        if (this.selectedLeagueUuid) {
            setTimeout(() => {
                this.scroll(this.selectedLeagueUuid);
            }, 1000);
        }
    }

    sanitizeLogo(logo: string): SafeResourceUrl {
        const logoSanitized = 'data:Image/*;base64,' + logo
        return this.sanitizer.bypassSecurityTrustResourceUrl(logoSanitized);
    }

    replaceLeagueUuidQueryParam(open: boolean, uuid: string) {
        let queryParams: Params;

        if (open) {
            this.selectedLeagueUuid = uuid;
            queryParams = {expand: this.selectedLeagueUuid};
        } else {
            this.selectedLeagueUuid = null;
            queryParams = {};
        }

        this.router.navigate([], {
            relativeTo: this.route,
            queryParams,
        });
    }

    scroll(id: string) {
        const leagueElement = document.getElementById(id);
        if (leagueElement) {
            leagueElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest',
            });
        } else {
            this.router.navigate([], {
                relativeTo: this.route,
            });
        }
    }
}
