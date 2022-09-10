import {Component, Input, OnInit} from '@angular/core';
import {Match} from "../../shared/rest-api-dto/match.model";

@Component({
    selector: 'app-score-logs',
    templateUrl: './score-logs.component.html',
    styleUrls: ['./score-logs.component.css']
})
export class ScoreLogsComponent implements OnInit {

    @Input() match: Match;

    constructor() {
    }

    ngOnInit(): void {
    }

}
