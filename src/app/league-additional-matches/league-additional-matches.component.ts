import {Component, OnInit} from '@angular/core';
import {AdditionalMatch} from "../shared/rest-api-dto/additional-match.model";
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {map} from "rxjs/operators";
import {plainToClass} from "class-transformer";
import {MatTableDataSource} from "@angular/material/table";
import {PlayerDetailed} from "../shared/rest-api-dto/player-detailed.model";

@Component({
    selector: 'app-league-additional-matches',
    templateUrl: './league-additional-matches.component.html',
    styleUrls: ['./league-additional-matches.component.css']
})
export class LeagueAdditionalMatchesComponent implements OnInit {

    displayedColumns: string[] = [
        'date-column',
        'type-column',
        'first-player',
        'second-player',
        'first-set-first-player',
        'first-set-second-player',
        'second-set-first-player',
        'second-set-second-player',
        'third-set-first-player',
        'third-set-second-player',
        'mod-column',
    ];

    uuid: string;
    additionalMatches: AdditionalMatch[];
    leagueLogoBytes: string
    currentPlayer: PlayerDetailed;


    dataSource: MatTableDataSource<AdditionalMatch>;


    constructor(private route: ActivatedRoute,
                private http: HttpClient,
                private apiEndpointsService: ApiEndpointsService) {

    }

    ngOnInit(): void {
        this.route
            .params
            .subscribe(params => {
                this.uuid = params['uuid'];
            });

        this.http
            .get<AdditionalMatch[]>(this.apiEndpointsService.getAllAdditionalMatchesForLeague(this.uuid))
            .pipe(map(result => plainToClass(AdditionalMatch, result)))
            .subscribe(result => {
                this.additionalMatches = result;
                this.dataSource = new MatTableDataSource<AdditionalMatch>(this.additionalMatches);
            });

        this.http
            .get(this.apiEndpointsService.getLeagueLogo(this.uuid), {responseType: 'text'})
            .subscribe((result) => {
                this.leagueLogoBytes = result;
            });

        this.http
            .get<PlayerDetailed>(this.apiEndpointsService.getAboutMeInfo())
            .pipe(map((result) => plainToClass(PlayerDetailed, result)),)
            .subscribe(
                result => {
                    this.currentPlayer = result
                }
            );
    }

    isForPlayer(match: AdditionalMatch) {
        if (this.currentPlayer.isAdmin()) {
            return true;
        } else if (this.currentPlayer.hasRoleForLeague(this.uuid, 'MODERATOR')) {
            return true;
        }

        return match.firstPlayer.username === this.currentPlayer.username
            || match.secondPlayer.username === this.currentPlayer.username;
    }

    modify(match: AdditionalMatch) {
        // NOT IMPLEMENTED
    }

}
