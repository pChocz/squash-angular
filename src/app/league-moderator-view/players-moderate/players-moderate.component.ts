import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ApiEndpointsService} from "../../shared/api-endpoints.service";
import {PlayerForLeagueModerator} from "../../shared/rest-api-dto/player-for-league-moderator.model";
import {map} from "rxjs/operators";
import {plainToInstance} from "class-transformer";

@Component({
    selector: 'app-players-moderate',
    templateUrl: './players-moderate.component.html',
    styleUrls: ['./players-moderate.component.css']
})
export class PlayersModerateComponent implements OnInit {

    @Input() isModerator: boolean;
    @Input() isOwner: boolean;
    @Input() leagueUuid: string;

    players: PlayerForLeagueModerator[];
    moderators: PlayerForLeagueModerator[];
    owners: PlayerForLeagueModerator[];

    constructor(private http: HttpClient,
                private apiEndpointsService: ApiEndpointsService) {
    }

    ngOnInit(): void {
        this.setupComponent();
    }

    setupComponent() {
        this.http
            .get<PlayerForLeagueModerator[]>(this.apiEndpointsService.getLeaguePlayersForLeagueModeratorByUuid(this.leagueUuid))
            .pipe(map((result) => plainToInstance(PlayerForLeagueModerator, result)))
            .subscribe((result) => {
                result.sort((a, b) => a.username.localeCompare(b.username));
                this.players = result.filter(player => player.isPlayer());
                this.moderators = result.filter(player => player.isModerator());
                this.owners = result.filter(player => player.isOwner());
            });
    }


    updating(event: any): void {
        this.setupComponent();
    }

}
