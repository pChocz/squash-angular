import {Component, HostListener, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {ApiEndpointsService} from "../shared/api-endpoints.service";

@Component({
    selector: 'app-remove-round-dialog',
    templateUrl: './remove-round-dialog.component.html',
})
export class RemoveRoundDialogComponent {

    input: string;

    constructor(
        private router: Router,
        private http: HttpClient,
        private apiEndpointsService: ApiEndpointsService,
        private dialogRef: MatDialogRef<RemoveRoundDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { roundUuid: string, seasonUuid: string }) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onConfirmClick(): void {
        this.http
            .delete(this.apiEndpointsService.getRoundByUuid(this.data.roundUuid))
            .subscribe(() => {
                this.router.navigate(['season', this.data.seasonUuid]);
            });

        this.dialogRef.close();
    }

    @HostListener('document:keydown', ['$event'])
    handleDeleteKeyboardEvent(event: KeyboardEvent) {
        if (event.key === 'Enter' && this.input.toLowerCase() === 'remove') {
            this.onConfirmClick();
        }
    }

}