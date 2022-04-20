import {Component, Input, OnInit} from '@angular/core';
import {League} from "../../shared/rest-api-dto/league.model";

@Component({
    selector: 'app-leagues-admin-view',
    templateUrl: './leagues-admin-view.component.html',
    styleUrls: ['./leagues-admin-view.component.css']
})
export class LeaguesAdminViewComponent implements OnInit {

    @Input() leagues: League[];
    @Input() logosMap: Map<string, string>;

    constructor() {
    }

    ngOnInit(): void {
    }

}
