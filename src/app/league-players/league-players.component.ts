import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Player} from '../shared/rest-api-dto/player.model';
import {map} from 'rxjs/operators';
import {plainToClass} from 'class-transformer';
import {DomSanitizer, SafeResourceUrl, Title} from '@angular/platform-browser';
import {League} from '../shared/rest-api-dto/league.model';
import {environment} from 'src/environments/environment';
import {Subject} from 'rxjs';
import {ApiEndpointsService} from "../shared/api-endpoints.service";

@Component({
    selector: 'app-league-players',
    templateUrl: './league-players.component.html',
    styleUrls: ['./league-players.component.css'],
})
export class LeaguePlayersComponent implements OnInit, OnDestroy {

    destroy$: Subject<boolean> = new Subject<boolean>();

    leagueUuid: string;
    league: League;
    players: Player[];
    isLoading: boolean;

    constructor(private route: ActivatedRoute,
                private apiEndpointsService: ApiEndpointsService,
                private sanitizer: DomSanitizer,
                private http: HttpClient,
                private titleService: Title) {

    }

    ngOnInit(): void {
        this.route.params.subscribe((params) => (this.leagueUuid = params.uuid));

        this.http
            .get<League>(this.apiEndpointsService.getLeagueGeneralInfoByUuid(this.leagueUuid))
            .pipe(map((result) => plainToClass(League, result)))
            .subscribe((result) => {
                this.league = result;
                console.log(this.league);
                this.titleService.setTitle('Players | ' + this.league.leagueName);
            });

        this.http
            .get<Player[]>(this.apiEndpointsService.getLeaguePlayersByUuid(this.leagueUuid))
            .pipe(map((result) => plainToClass(Player, result)))
            .subscribe((result) => {
                this.players = result;
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    sanitizeLogo(leagueDto: League): SafeResourceUrl {
        const logo: string = leagueDto.logoSanitized();
        return this.sanitizer.bypassSecurityTrustResourceUrl(logo);
    }

}
