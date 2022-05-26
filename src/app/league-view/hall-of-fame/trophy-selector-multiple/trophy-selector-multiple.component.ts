import {Component, Input, OnInit} from '@angular/core';
import {Player} from "../../../shared/rest-api-dto/player.model";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ApiEndpointsService} from "../../../shared/api-endpoints.service";
import {SeasonTrophies} from "../../../shared/rest-api-dto/season-trophies.model";

@Component({
    selector: 'app-trophy-selector-multiple',
    templateUrl: './trophy-selector-multiple.component.html',
    styleUrls: ['./trophy-selector-multiple.component.css']
})
export class TrophySelectorMultipleComponent implements OnInit {

    @Input() public trophyType: string;
    @Input() public leagueUuid: string;
    @Input() public seasonNumber: number;
    @Input() public seasonTrophies: SeasonTrophies;
    @Input() public leaguePlayers: Player[];
    @Input() public matchingPlayers: Player[];

    public copyLeaguePlayers: Player[];

    constructor(private http: HttpClient,
                private apiEndpointsService: ApiEndpointsService) {
    }

    ngOnInit(): void {
        this.matchingPlayers = this.getAllMatchingPlayers();
        this.copyLeaguePlayers = JSON.parse(JSON.stringify(this.leaguePlayers));
        for (let player of this.matchingPlayers) {
            const p: Player = this.copyLeaguePlayers.filter(p => p.uuid === player.uuid).pop();
            const index: number = this.copyLeaguePlayers.indexOf(p);
            if (index >= 0) {
                this.copyLeaguePlayers.splice(index, 1);
            }
        }
    }

    getAllMatchingPlayers(): Player[] {
        return this
            .seasonTrophies
            .findAllPlayersForTrophy(this.trophyType);
    }

    addTrophy(player: Player) {
        this.http
            .post<any>(this.apiEndpointsService.getTrophies(),
                {},
                {params: this.buildHttpParams(player)})
            .subscribe(() => {
                this.matchingPlayers.push(player);
                const index = this.copyLeaguePlayers.indexOf(player);
                if (index >= 0) {
                    this.copyLeaguePlayers.splice(index, 1);
                }
            });
    }

    removeTrophy(player: Player): void {
        this.http
            .delete<any>(this.apiEndpointsService.getTrophies(),
                {params: this.buildHttpParams(player)})
            .subscribe(() => {
                this.copyLeaguePlayers.push(JSON.parse(JSON.stringify(player)));
                this.copyLeaguePlayers.sort((a, b) => a.username.localeCompare(b.username))
                const index = this.matchingPlayers.indexOf(player);
                if (index >= 0) {
                    this.matchingPlayers.splice(index, 1);
                }
            });
    }

    private buildHttpParams(player: Player) {
        return new HttpParams()
            .set('playerUuid', player.uuid)
            .set('leagueUuid', this.leagueUuid)
            .set('seasonNumber', this.seasonNumber)
            .set('trophy', this.trophyType);
    }

}
