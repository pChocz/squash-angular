import {Component} from "@angular/core";
import {MatDialogRef} from "@angular/material/dialog";
import {HttpClient} from "@angular/common/http";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {Globals} from "../globals";
import {NotificationService} from "../shared/notification.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-delete-account-dialog',
    templateUrl: './delete-account-dialog.component.html',
})
export class DeleteAccountDialogComponent {

    deletingAccount = false;

    constructor(private http: HttpClient,
                private notificationService: NotificationService,
                private router: Router,
                private apiEndpointsService: ApiEndpointsService,
                private dialogRef: MatDialogRef<DeleteAccountDialogComponent>) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onConfirmClick(): void {
        this.deletingAccount = true;
        this.http
            .post<any>(this.apiEndpointsService.getDeleteMyAccount(),
                {}
            )
            .subscribe({
                next: () => {
                    localStorage.removeItem(Globals.STORAGE_JWT_TOKEN_KEY);
                    localStorage.removeItem(Globals.STORAGE_REFRESH_TOKEN_KEY);
                    this.dialogRef.close();
                    this.notificationService.success('myAccount.deleteAccount.successMessage');
                    this.router.navigate([`/login`]);
                },
                error: () => {
                    // nothing
                },
                complete: () => {
                    this.deletingAccount = false;
                }
            });
    }
}
