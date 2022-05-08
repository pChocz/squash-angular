import {Component, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-role-details',
    templateUrl: './role-details.component.html',
    styleUrls: ['./role-details.component.css']
})
export class RoleDetailsComponent implements OnInit {

    ownerPermissionsKeys: string[];
    moderatorPermissionsKeys: string[];
    playerPermissionsKeys: string[];
    anonymousPermissionsKeys: string[];

    constructor(private translateService: TranslateService) {
        this.translateService
            .get('league.moderate.permissionLevel.owner')
            .subscribe((res) => {
                this.ownerPermissionsKeys = Object.keys(res);
            });
        this.translateService
            .get('league.moderate.permissionLevel.moderator')
            .subscribe((res) => {
                this.moderatorPermissionsKeys = Object.keys(res);
            });
        this.translateService
            .get('league.moderate.permissionLevel.player')
            .subscribe((res) => {
                this.playerPermissionsKeys = Object.keys(res);
            });
        this.translateService
            .get('league.moderate.permissionLevel.anonymous')
            .subscribe((res) => {
                this.anonymousPermissionsKeys = Object.keys(res);
            });
    }

    ngOnInit(): void {
    }

}
