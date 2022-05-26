import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HttpClient} from "@angular/common/http";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {TokenDecodeService} from "../shared/token-decode.service";
import {NotificationService} from "../shared/notification.service";

@Component({
    selector: 'app-change-emoji-dialog',
    templateUrl: './change-emoji-dialog.component.html',
})
export class ChangeEmojiDialogComponent {

    emojis: string[];
    newEmoji: string;
    currentEmoji: string;
    playerUuid: string;

    constructor(private http: HttpClient,
                private tokenDecodeService: TokenDecodeService,
                private notificationService: NotificationService,
                private apiEndpointsService: ApiEndpointsService,
                private dialogRef: MatDialogRef<ChangeEmojiDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: { emoji: string, playerUuid: string }) {

        this.currentEmoji = data.emoji;
        this.playerUuid = data.playerUuid;

        this.http
            .get<string[]>(this.apiEndpointsService.getEmoji())
            .subscribe({
                next: (result) => {
                    this.emojis = result;
                }
            });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onConfirmClick(): void {
        const requestPath = this.playerUuid
            ? this.apiEndpointsService.getEmojiForPlayer(this.playerUuid)
            : this.apiEndpointsService.getEmoji();

        this.http
            .post<any>(requestPath,
                {},
                {
                    params: {
                        newEmoji: this.newEmoji
                    },
                }
            )
            .subscribe({
                next: () => {
                    this.notificationService.success('myAccount.emoji.changeSuccess')
                    this.tokenDecodeService.refresh();
                },
                complete: () => {
                    this.dialogRef.close();
                }
            });
    }

    chooseEmoji(emoji: string) {
        this.newEmoji = emoji;
    }
}
