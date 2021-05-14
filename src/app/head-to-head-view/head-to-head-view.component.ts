import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {MatDialog} from "@angular/material/dialog";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {map} from "rxjs/operators";
import {plainToClass} from "class-transformer";
import {HeadToHeadScoreboard} from "../shared/rest-api-dto/head-to-head-scoreboard.model";
import {Title} from "@angular/platform-browser";

@Component({
    selector: 'app-head-to-head-view',
    templateUrl: './head-to-head-view.component.html',
    styleUrls: ['./head-to-head-view.component.css']
})
export class HeadToHeadViewComponent implements OnInit {

    options = {
        legend: 'none',
        bar: {groupWidth: '100%'},
        candlestick: {
            fallingColor: {strokeWidth: 0, fill: '#ff0000'},
            risingColor: {strokeWidth: 0, fill: '#48E96A'}
        },
        vAxis: {
            gridlines: {
                interval: 0
            },
            baselineColor: 'transparent'
        },
        backgroundColor: {fill: 'transparent'},
        hAxis: {
            textPosition: 'none'
        },
        animation: {
            startup: true,
            duration: 1,
            easing: 'out'
        }
    };

    firstPlayerUuid: string;
    secondPlayerUuid: string;
    leagueUuid: string;

    scoreboard: HeadToHeadScoreboard;
    isLoading: boolean;

    constructor(private route: ActivatedRoute,
                private http: HttpClient,
                private dialog: MatDialog,
                private titleService: Title,
                private apiEndpointsService: ApiEndpointsService) {

        this.isLoading = true;

    }

    ngOnInit(): void {
        this.route
            .params
            .subscribe(params => {
                this.firstPlayerUuid = params['firstPlayerUuid'];
                this.secondPlayerUuid = params['secondPlayerUuid'];
            });

        this.http
            .get<HeadToHeadScoreboard>(this.apiEndpointsService.getHeadToHead(this.firstPlayerUuid, this.secondPlayerUuid))
            .pipe(map((result) => plainToClass(HeadToHeadScoreboard, result)))
            .subscribe((result) => {
                this.scoreboard = result;

                if (this.scoreboard.numberOfMatches === 0) {
                    this.titleService.setTitle('h2h');

                } else {
                    this.titleService.setTitle('h2h | ' + this.scoreboard.winner.player + ' v ' + this.scoreboard.looser.player);
                }

                console.log(this.scoreboard);
                console.log(this.scoreboard.chartData.array);
                this.isLoading = false;
            });

    }

}
