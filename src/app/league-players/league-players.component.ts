import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Player } from '../shared/rest-api-dto/player.model';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { PlayersScoreboard } from '../shared/rest-api-dto/players-scoreboard.model';
import { Title, DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { League } from '../shared/rest-api-dto/league.model';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { MatchesPaginated } from '../shared/rest-api-dto/matches-paginated.model';

@Component({
    selector: 'app-league-players',
    templateUrl: './league-players.component.html',
    styleUrls: ['./league-players.component.css'],
})
export class LeaguePlayersComponent implements OnInit, OnDestroy {
    destroy$: Subject<boolean> = new Subject<boolean>();

    leagueUuid: string;
    league: League;

    selectionMap: Map<Player, boolean>;
    selectedSeasonUuid: string;
    selectedGroupNumber: number;
    selectedPlayersUuids: string[];

    players: Player[];
    selectedPlayers: Player[] = [];
    playersScoreboard: PlayersScoreboard;

    matchesSimplePaginated: MatchesPaginated;

    allChecked: boolean;
    noMatchesPlayed: boolean;

    isLoading: boolean;

    constructor(
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer,
        private http: HttpClient,
        private titleService: Title
    ) {
        this.selectionMap = new Map();
        this.selectedSeasonUuid = '';
        this.selectedGroupNumber = 0;
    }

    ngOnInit(): void {
        this.route.params.subscribe((params) => (this.leagueUuid = params.uuid));

        this.http
            .get<League>(environment.apiUrl + 'leagues/general-info/' + this.leagueUuid)
            .pipe(map((result) => plainToClass(League, result)))
            .subscribe((result) => {
                this.league = result;
                console.log(this.league);
                this.titleService.setTitle('Players | ' + this.league.leagueName);
            });

        this.http
            .get<Player[]>(environment.apiUrl + 'leagues/' + this.leagueUuid + '/players-general')
            .pipe(map((result) => plainToClass(Player, result)))
            .subscribe((result) => {
                this.players = result;
                this.players.forEach((player) => this.selectionMap.set(player, false));
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

    onChange(player: Player, selected: boolean): void {
        this.selectionMap.set(player, selected);
        this.updateComponent();
    }

    onSeasonSelectChange(newValue: string): void {
        this.selectedSeasonUuid = newValue;
        this.updateComponent();
    }

    onGroupSelectChange(newValue: number): void {
        this.selectedGroupNumber = newValue;
        this.updateComponent();
    }

    selectAll(): void {
        for (const [key, value] of this.selectionMap) {
            this.selectionMap.set(key, true);
        }
        this.updateComponent();
    }

    deselectAll(): void {
        for (const [key, value] of this.selectionMap) {
            this.selectionMap.set(key, false);
        }
        this.updateComponent();
    }

    updateComponent(): void {
        this.isLoading = true;
        this.playersScoreboard = null;
        this.noMatchesPlayed = false;
        this.selectedPlayers = [];

        for (const [key, value] of this.selectionMap) {
            if (value) {
                this.selectedPlayers.push(key);
            }
        }

        if (this.selectedPlayers.length > 0) {
            this.selectedPlayersUuids = this.selectedPlayers.map(player => player.uuid);

            const scoreboardLink: string =
                environment.apiUrl +
                'players-scoreboards/leagues/' +
                this.leagueUuid +
                '/players/' +
                this.selectedPlayersUuids;

            let httpParams = new HttpParams();
            if (this.selectedSeasonUuid !== '0') {
                httpParams = httpParams.append('seasonUuid', this.selectedSeasonUuid);
            }
            if (this.selectedGroupNumber > 0) {
                httpParams = httpParams.append('groupNumber', String(this.selectedGroupNumber));
            }

            this.http
                .get<PlayersScoreboard>(scoreboardLink, { params: httpParams })
                .pipe(map((result) => plainToClass(PlayersScoreboard, result)))
                .subscribe((result) => {
                    this.playersScoreboard = result;
                    if (this.playersScoreboard.numberOfMatches === 0) {
                        this.noMatchesPlayed = true;
                        this.playersScoreboard = null;
                    }
                    this.isLoading = false;
                });
        } else {
            this.isLoading = false;
        }
    }
}
