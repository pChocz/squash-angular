import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ApiEndpointsService} from "../../shared/api-endpoints.service";
import {SeasonScoreboard} from "../../shared/rest-api-dto/season-scoreboard.model";
import {map} from "rxjs/operators";
import {plainToInstance} from "class-transformer";

@Component({
    selector: 'app-current-season',
    templateUrl: './current-season.component.html',
    styleUrls: ['./current-season.component.css']
})
export class CurrentSeasonComponent implements OnInit {

    @Input() uuid: string;
    seasonScoreboard: SeasonScoreboard;

    constructor(private http: HttpClient,
                private apiEndpointsService: ApiEndpointsService) {

    }

    ngOnInit(): void {
        this.http
            .get<SeasonScoreboard>(this.apiEndpointsService.getCurrentSeasonScoreboardForLeagueByUuid(this.uuid))
            .pipe(map(result => plainToInstance(SeasonScoreboard, result)))
            .subscribe(result => {
                this.seasonScoreboard = result;
            });
    }

}
