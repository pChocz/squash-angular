import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {ApiEndpointsService} from "../../shared/api-endpoints.service";
import {HttpClient} from "@angular/common/http";
import {Match} from "../../shared/rest-api-dto/match.model";
import {CustomValidators} from "../../shared/custom-validators";

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


    playerControl = new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
        CustomValidators.noSpecialCharactersValidator()
    ]);

    constructor(private apiEndpointsService: ApiEndpointsService,
                private http: HttpClient) {

    }

    ngOnInit(): void {

    }

    addPlayer() {
        this.http
            .put(this.apiEndpointsService.getLeagueRolesByUsername(this.leagueUuid, this.playerControl.value, this.type), {})
            .subscribe({
                next: () => {
                    console.log("ASSIGNING ROLE");
                },
                error: () => {
                    console.log("ASSIGNING ROLE - ERROR -");
                },
                complete: () => {
                    console.log("dsadsad");
                    this.change.emit(true);
                }
            });
    }

    removePlayer() {
        this.http
            .delete(this.apiEndpointsService.getLeagueRolesByUsername(this.leagueUuid, this.playerControl.value, this.type), {})
            .subscribe({
                next: () => {
                    console.log("ASSIGNING ROLE");
                },
                error: () => {
                    console.log("ASSIGNING ROLE - ERROR -");
                },
                complete: () => {
                    console.log("dsadsad");
                    this.change.emit(true);
                }
            });
    }

}
