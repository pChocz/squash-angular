import {Component, Inject} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ApiEndpointsService} from "../../shared/api-endpoints.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormControl, Validators} from "@angular/forms";

@Component({
    selector: 'app-add-rule-dialog',
    templateUrl: './add-rule-dialog.component.html',
})
export class AddRuleDialogComponent {

    leagueUuid: string;

    selectedType: string;

    ruleField = new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(1000),
    ]);

    types: string[] = [
        'SEASON',
        'ROUND',
        'OTHER',
        'PAYMENT'
    ];

    constructor(private http: HttpClient,
                private apiEndpointsService: ApiEndpointsService,
                private dialogRef: MatDialogRef<AddRuleDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: { leagueUuid: string }) {
        this.leagueUuid = data.leagueUuid;
        this.selectedType = 'OTHER';
    }

    onConfirmClick(): void {
        let params = new HttpParams();
        params = params.set('leagueUuid', this.leagueUuid);
        params = params.set('rule', this.ruleField.value);
        params = params.set('type', this.selectedType);

        this.http
            .post(this.apiEndpointsService.getLeagueRule(),
                null,
                {params: params}
            )
            .subscribe({
                next: () => {
                    this.dialogRef.close(true);
                }
            });
    }

    onCancelClick(): void {
        this.dialogRef.close();
    }

    anyFieldInvalid(): boolean {
        return this.ruleField.invalid;
    }

}
