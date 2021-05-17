import {Component, Input, OnInit} from '@angular/core';
import {LeagueOveralStats} from "../../shared/rest-api-dto/league-overal-stats.model";

@Component({
    selector: 'app-league-board',
    templateUrl: './league-board.component.html',
    styleUrls: ['./league-board.component.css']
})
export class LeagueBoardComponent implements OnInit {

    @Input() overalStats: LeagueOveralStats;
    @Input() uuid: string;

    constructor() {
    }

    ngOnInit(): void {
    }

}
