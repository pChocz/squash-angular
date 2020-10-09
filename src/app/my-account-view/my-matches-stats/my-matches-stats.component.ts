import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatchesGroupedPerLeague } from '../../shared/rest-api-dto/matches-grouped-per-league.model';
import { Player } from '../../shared/rest-api-dto/player.model';
import { MatRadioChange } from '@angular/material/radio';
import { PlayersScoreboard } from 'src/app/shared/rest-api-dto/players-scoreboard.model';
import { MatchesPaginated } from 'src/app/shared/rest-api-dto/matches-paginated.model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { plainToClass } from 'class-transformer';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-my-matches-stats',
    templateUrl: './my-matches-stats.component.html',
    styleUrls: ['./my-matches-stats.component.css'],
})
export class MyMatchesStatsComponent implements OnInit {
    @Input() matchesGroupedPerLeagues: MatchesGroupedPerLeague[];
    selectionMap: Map<Player, boolean>;
    selectedLeague: MatchesGroupedPerLeague;
    playersScoreboard: PlayersScoreboard;
    matchesSimplePaginated: MatchesPaginated;
    commaSeparatedPlayersIds: string;
    isLoading: boolean;

    constructor(private http: HttpClient) {
        this.selectionMap = new Map();
    }

    ngOnInit(): void {}

    onChange(player: Player, selected: boolean): void {
        this.selectionMap.set(player, selected);
        this.updateComponent();
    }

    clearSelection(event: MatRadioChange): void {
        this.selectedLeague = event.value;
        this.selectionMap.clear();

        this.selectedLeague.perPlayer.forEach((perPlayer) => this.selectionMap.set(perPlayer.player, false));
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

        const leagueUuid = this.selectedLeague.league.uuid;
        const playerUuids: string[] = [];
        for (const [player, selected] of this.selectionMap) {
            if (selected) {
                playerUuids.push(player.uuid);
            }
        }

        if (playerUuids.length > 0) {
            const scoreboardLink: string =
                environment.apiUrl +
                'players-scoreboards/leagues/' +
                leagueUuid +
                '/players/' +
                playerUuids +
                '/me-against-all';

            this.http
                .get<PlayersScoreboard>(scoreboardLink)
                .pipe(map((result) => plainToClass(PlayersScoreboard, result)))
                .subscribe((result) => {
                    this.playersScoreboard = result;
                    this.isLoading = false;
                });
        } else {
            this.isLoading = false;
        }
    }
}
