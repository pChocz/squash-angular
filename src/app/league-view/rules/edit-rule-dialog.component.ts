import {Component, Inject} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ApiEndpointsService} from "../../shared/api-endpoints.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {LeagueRule} from "../../shared/rest-api-dto/league-rule.model";
import {FormControl, Validators} from "@angular/forms";
import {Globals} from "../../globals";

@Component({
    selector: 'app-edit-rule-dialog',
    templateUrl: './edit-rule-dialog.component.html',
})
export class EditRuleDialogComponent {

    rule: LeagueRule;

    selectedType: string;

    ruleField = new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(1000),
    ]);

    orderValueField = new FormControl('', [
        Validators.pattern('(?<!\\S)(?=.)(0|([1-9](\\d*|\\d{0,2}(,\\d{3})*)))?(\\.\\d*[1-9])?(?!\\S)'),
        Validators.maxLength(10),
    ]);

    types = Globals.RULE_TYPES;

    constructor(private http: HttpClient,
                private apiEndpointsService: ApiEndpointsService,
                private dialogRef: MatDialogRef<EditRuleDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: { leagueRule: LeagueRule }) {
        this.rule = data.leagueRule;
        this.ruleField.setValue(this.rule.rule);
        this.orderValueField.setValue(this.rule.orderValue);
        this.selectedType = this.rule.type;
    }

    onConfirmClick(): void {
        let orderValueChanged = this.rule.orderValue !== this.orderValueField.value;
        let ruleChanged = this.rule.rule !== this.ruleField.value;
        let typeChanged = this.rule.type !== this.selectedType;

        let params = new HttpParams();
        if (orderValueChanged) {
            params = params.set('orderValue', this.orderValueField.value);
        }
        if (ruleChanged) {
            params = params.set('rule', this.ruleField.value);
        }
        if (typeChanged) {
            params = params.set('type', this.selectedType);
        }

        if (params.keys().length > 0) {
            this.http
                .put(this.apiEndpointsService.getLeagueRuleByUuid(this.rule.uuid),
                    null,
                    {params: params}
                )
                .subscribe({
                    next: () => {
                        this.dialogRef.close(true);
                    }
                });
        }
    }


    onCancelClick(): void {
        this.dialogRef.close();
    }

    anyFieldInvalid(): boolean {
        return this.ruleField.invalid
            || this.orderValueField.invalid;
    }

    unchanged(): boolean {
        return this.rule.rule === this.ruleField.value
            && this.rule.orderValue === this.orderValueField.value
            && this.rule.type === this.selectedType;
    }

}