import {Component, Input, OnInit} from '@angular/core';
import {Season} from "../shared/rest-api-dto/season.model";

@Component({
    selector: 'app-league-actions-buttons',
    templateUrl: './league-actions-buttons.component.html',
    styleUrls: ['./league-actions-buttons.component.css']
})
export class LeagueActionsButtonsComponent implements OnInit {

    @Input() leagueUuid: string;
    @Input() seasons: Season[];
    @Input() showLeague: boolean = true;
    @Input() showPlayers: boolean = true;
    @Input() showStats: boolean = true;
    @Input() showAdditionalMatches: boolean = true;
    @Input() showModeratorEdit: boolean = false;

    constructor() {

    }

    ngOnInit(): void {
    }

}
