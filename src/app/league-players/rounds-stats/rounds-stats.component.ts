import {Component, Input, OnInit} from '@angular/core';
import {League} from "../../shared/rest-api-dto/league.model";
import {Player} from "../../shared/rest-api-dto/player.model";
import {HttpClient, HttpParams} from "@angular/common/http";
import {map} from "rxjs/operators";
import {plainToClass} from "class-transformer";
import {PlayerSingleRoundsStats} from "../../shared/rest-api-dto/player-single-rounds-stats.model";
import {environment} from "../../../environments/environment";
import {ApiEndpointsService} from "../../shared/api-endpoints.service";

@Component({
    selector: 'app-rounds-stats',
    templateUrl: './rounds-stats.component.html',
    styleUrls: ['./rounds-stats.component.css']
})
export class RoundsStatsComponent implements OnInit {

    @Input() league: League;
    @Input() players: Player[];
    selectedPlayer: Player;

    stats: PlayerSingleRoundsStats[];

    isLoading: boolean;
    noStatsAvailable: boolean;

    constructor(private http: HttpClient,
                private apiEndpointsService: ApiEndpointsService) {
    }

    ngOnInit(): void {
    }

    loadStatsForPlayer(selectedPlayer: Player) {
        this.stats = null;
        this.isLoading = true;
        this.noStatsAvailable = false;

        this.http
            .get<PlayerSingleRoundsStats[]>(this.apiEndpointsService.getPlayerRoundsStats(this.league.leagueUuid, selectedPlayer.uuid))
            .pipe(map(result => plainToClass(PlayerSingleRoundsStats, result)))
            .subscribe(
                result => {
                    if (result.length > 0) {
                        this.stats = result;
                    } else {
                        this.noStatsAvailable = true;
                    }
                },
                error => {
                    console.log(error);
                    this.noStatsAvailable = true;
                },
                () => {
                    this.isLoading = false;
                    console.log(this.stats);
                });
    }

}
