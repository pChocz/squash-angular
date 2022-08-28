import {Component, Inject} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ApiEndpointsService} from "../api-endpoints.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UntypedFormControl, Validators} from "@angular/forms";
import {Match} from "../rest-api-dto/match.model";
import {AdditionalMatch} from "../rest-api-dto/additional-match.model";

@Component({
    selector: 'app-edit-match-footage-dialog',
    templateUrl: './edit-match-footage-dialog.component.html',
})
export class EditMatchFootageDialogComponent {

    match: Match | AdditionalMatch;

    footageLinkField = new UntypedFormControl('', [
        Validators.min(5),
        Validators.maxLength(100),
    ]);

    constructor(private http: HttpClient,
                private apiEndpointsService: ApiEndpointsService,
                private dialogRef: MatDialogRef<EditMatchFootageDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: { match: Match | AdditionalMatch }) {
        this.match = data.match;
        this.footageLinkField.setValue(data.match.footageLink);
    }

    onConfirmClick(): void {
            this.http
                .put(this.match instanceof AdditionalMatch
                        ? this.apiEndpointsService.getAddOrReplaceFootageForAdditionalMatch(this.match.matchUuid)
                        : this.apiEndpointsService.getAddOrReplaceFootageForMatch(this.match.matchUuid)
                    ,
                    {},
                    {
                        params: {
                            footageLink: this.footageLinkField.value
                        },
                    }
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

    isInvalid(): boolean {
        return this.footageLinkField.invalid;
    }

    unchanged(): boolean {
        return this.match.footageLink === this.footageLinkField.value;
    }
}
