import {Component, Input, OnInit} from '@angular/core';
import {LeagueRule} from "../../shared/rest-api-dto/league-rule.model";

@Component({
    selector: 'app-rules',
    templateUrl: './rules.component.html',
    styleUrls: ['./rules.component.css']
})
export class RulesComponent implements OnInit {

    @Input() rules: LeagueRule[];
    @Input() isModerator: boolean;

    constructor() {
    }

    ngOnInit(): void {
    }

}
