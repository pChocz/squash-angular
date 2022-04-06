import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";
import {AuthService} from "../shared/auth.service";
import {TokenDecodeService} from "../shared/token-decode.service";

@Component({
    selector: 'app-change-emoji-dialog',
    templateUrl: './change-emoji-dialog.component.html',
})
export class ChangeEmojiDialogComponent {

    emojis: string[];
    newEmoji: string;
    currentEmoji: string;
    playerUuid: string;

    constructor(private router: Router,
                private http: HttpClient,
                private snackBar: MatSnackBar,
                private tokenDecodeService: TokenDecodeService,
                private auth: AuthService,
                private translateService: TranslateService,
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
                    this.tokenDecodeService.refresh();
                    this.dialogRef.close();

                },
                error: (error) => {
                    console.log("ERROR");
                    this.dialogRef.close();
                }
            });
    }

    chooseEmoji(emoji: string) {
        this.newEmoji = emoji;
    }
}
