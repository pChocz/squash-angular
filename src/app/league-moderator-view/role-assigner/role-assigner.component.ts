import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UntypedFormControl, Validators} from "@angular/forms";
import {ApiEndpointsService} from "../../shared/api-endpoints.service";
import {HttpClient} from "@angular/common/http";
import {CustomValidators} from "../../shared/custom-validators";
import {NotificationService} from "../../shared/notification.service";
import {map} from "rxjs/operators";
import {plainToInstance} from "class-transformer";
import {Season} from "../../shared/rest-api-dto/season.model";

@Component({
    selector: 'app-role-assigner',
    templateUrl: './role-assigner.component.html',
    styleUrls: ['./role-assigner.component.css']
})
export class RoleAssignerComponent implements OnInit {

    @Input() leagueUuid: string;
    @Input() type: string;
    @Input() description: string;

    @Output('update') change: EventEmitter<Boolean> = new EventEmitter<Boolean>();


    playerControl = new UntypedFormControl('', [
        Validators.required,
        Validators.maxLength(30),
        CustomValidators.noSpecialCharactersValidator()
    ]);

    constructor(private apiEndpointsService: ApiEndpointsService,
                private notificationService: NotificationService,
                private http: HttpClient) {

    }

    ngOnInit(): void {

    }

    addPlayer() {
        this.http
            .put(this.apiEndpointsService.getLeagueRolesByUsername(this.leagueUuid, this.playerControl.value, this.type), {})
            .subscribe({
                next: (result: boolean) => {
                    if (result === true) {
                        this.notificationService.success('league.moderate.role.assignSuccess');
                    }
                },
                complete: () => {
                    this.change.emit(true);
                }
            });
    }

    removePlayer() {
        this.http
            .delete(this.apiEndpointsService.getLeagueRolesByUsername(this.leagueUuid, this.playerControl.value, this.type), {})
            .subscribe({
                next: (result: boolean) => {
                    console.log(result);
                    if (result === true) {
                        this.notificationService.success('league.moderate.role.unassignSuccess');
                    }
                },
                complete: () => {
                    this.change.emit(true);
                }
            });
    }

}
