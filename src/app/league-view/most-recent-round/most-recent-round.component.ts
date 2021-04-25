import {Component, Input, OnInit} from '@angular/core';
import {RoundScoreboard} from "../../shared/rest-api-dto/round-scoreboard.model";
import {HttpClient} from "@angular/common/http";
import {ApiEndpointsService} from "../../shared/api-endpoints.service";
import {map} from "rxjs/operators";
import {plainToClass} from "class-transformer";

@Component({
    selector: 'app-most-recent-round',
    templateUrl: './most-recent-round.component.html',
    styleUrls: ['./most-recent-round.component.css']
})
export class MostRecentRoundComponent implements OnInit {

    @Input() uuid: string;
    roundScoreboard: RoundScoreboard;

    constructor(private http: HttpClient,
                private apiEndpointsService: ApiEndpointsService) {

    }

    ngOnInit(): void {
        this.http
            .get<RoundScoreboard>(this.apiEndpointsService.getMostRecentRoundScoreboardForLeagueByUuid(this.uuid))
            .pipe(map(result => plainToClass(RoundScoreboard, result)))
            .subscribe(result => {
                this.roundScoreboard = result;
            });
    }

}
