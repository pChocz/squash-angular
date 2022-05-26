import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Player} from "../../../shared/rest-api-dto/player.model";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ApiEndpointsService} from "../../../shared/api-endpoints.service";
import {SeasonTrophies} from "../../../shared/rest-api-dto/season-trophies.model";
import {NotificationService} from "../../../shared/notification.service";
import {Match} from "../../../shared/rest-api-dto/match.model";

@Component({
    selector: 'app-trophy-selector',
    templateUrl: './trophy-selector.component.html',
    styleUrls: ['./trophy-selector.component.css']
})
export class TrophySelectorComponent implements OnInit {

    @Input() public trophyType: string;
    @Input() public leagueUuid: string;
    @Input() public seasonNumber: number;
    @Input() public seasonTrophies: SeasonTrophies;
    @Input() public leaguePlayers: Player[];
    @Output('update') change: EventEmitter<Boolean> = new EventEmitter<Boolean>();

    constructor(private http: HttpClient,
                private notificationService: NotificationService,
                private apiEndpointsService: ApiEndpointsService) {
    }

    ngOnInit(): void {
    }

    getMatchingPlayer() {
        let playerToFind: Player = this.seasonTrophies.findPlayerForTrophy(this.trophyType);
        if (playerToFind) {
            return this
                .leaguePlayers
                .filter(player => player.uuid === playerToFind.uuid)
                .pop();
        } else {
            return undefined;
        }
    }

    changeTrophy(newPlayer: Player) {
        if (newPlayer === null) {
            let currentPlayer: Player = this.seasonTrophies.findPlayerForTrophy(this.trophyType);
            if (currentPlayer) {
                let params = new HttpParams()
                    .set('playerUuid', currentPlayer.uuid)
                    .set('leagueUuid', this.leagueUuid)
                    .set('seasonNumber', this.seasonNumber)
                    .set('trophy', this.trophyType);

                this.http
                    .delete<any>(this.apiEndpointsService.getTrophies(), {params: params})
                    .subscribe({
                        next: () => {
                            this.notificationService.success('league.moderate.trophy.unassignSuccess')
                        },
                        complete: () => {
                            this.change.emit(true);
                        }
                    });
            }

        } else {
            let previousPlayer: Player = this.seasonTrophies.findPlayerForTrophy(this.trophyType);

            let params = new HttpParams()
                .set('newPlayerUuid', newPlayer.uuid)
                .set('leagueUuid', this.leagueUuid)
                .set('seasonNumber', this.seasonNumber)
                .set('trophy', this.trophyType);

            if (previousPlayer) {
                params = params.set('previousPlayerUuid', previousPlayer.uuid);
            }

            this.http
                .put<any>(this.apiEndpointsService.getTrophies(), {}, {params: params})
                .subscribe({
                    next: () => {
                        if (previousPlayer) {
                            this.notificationService.success('league.moderate.trophy.reassignSuccess')
                        } else {
                            this.notificationService.success('league.moderate.trophy.assignSuccess')
                        }
                    },
                    complete: () => {
                        this.change.emit(true);
                    }
                });
        }

    }

}
