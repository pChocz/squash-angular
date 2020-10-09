import { Component, OnInit } from '@angular/core';
import { TokenDecodeService } from '../shared/token-decode.service';
import { PlayerDetailed } from '../shared/rest-api-dto/player-detailed.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { MatchesGroupedPerLeague } from '../shared/rest-api-dto/matches-grouped-per-league.model';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-my-account-view',
    templateUrl: './my-account-view.component.html',
    styleUrls: ['./my-account-view.component.css'],
})
export class MyAccountViewComponent implements OnInit {
    currentPlayer: PlayerDetailed;

    matchesGroupedPerLeagues: MatchesGroupedPerLeague[];

    constructor(private http: HttpClient, private titleService: Title) {
        this.titleService.setTitle('My account');
        this.http
            .get<PlayerDetailed>(environment.apiUrl + 'players/me')
            .pipe(map((result) => plainToClass(PlayerDetailed, result)))
            .subscribe((result) => {
                this.currentPlayer = result;
            });

        this.http
            .get<MatchesGroupedPerLeague[]>(environment.apiUrl + 'matches/my-count')
            .pipe(map((result) => plainToClass(MatchesGroupedPerLeague, result)))
            .subscribe((result) => {
                this.matchesGroupedPerLeagues = result;
            });
    }

    ngOnInit(): void {}
}
