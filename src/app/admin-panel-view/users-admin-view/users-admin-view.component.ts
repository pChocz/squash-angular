import {Component, Input, OnInit} from '@angular/core';
import {PlayerDetailed} from "../../shared/rest-api-dto/player-detailed.model";

@Component({
    selector: 'app-users-admin-view',
    templateUrl: './users-admin-view.component.html',
    styleUrls: ['./users-admin-view.component.css']
})
export class UsersAdminViewComponent implements OnInit {

    @Input() players: PlayerDetailed[];

    constructor() {
    }

    ngOnInit(): void {
    }

}
