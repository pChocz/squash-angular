import {Component, HostListener, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {FormControl, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";
import {Globals} from "../globals";
import {AuthService} from "../shared/auth.service";
import {TokenDecodeService} from "../shared/token-decode.service";
import {MatProgressButtonOptions} from "mat-progress-buttons";

@Component({
  selector: 'app-change-emoji-dialog',
  templateUrl: './change-emoji-dialog.component.html',
})
export class ChangeEmojiDialogComponent {

  emojis: string[];
  newEmoji: string;
  currentEmoji: string;

  constructor(private router: Router,
              private http: HttpClient,
              private snackBar: MatSnackBar,
              private tokenDecodeService: TokenDecodeService,
              private auth: AuthService,
              private translateService: TranslateService,
              private apiEndpointsService: ApiEndpointsService,
              private dialogRef: MatDialogRef<ChangeEmojiDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { emoji: string }) {

    this.currentEmoji = data.emoji;

    this.http
    .get<string[]>(this.apiEndpointsService.getAllEmojis())
    .subscribe((result) => {
      this.emojis = result;
    });

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onConfirmClick(): void {

    this.http
    .post<any>(this.apiEndpointsService.getChangeEmoji(),
        {},
        {
          params: {
            newEmoji: this.newEmoji
          },
        }
    )
    .subscribe(() => {
          this.tokenDecodeService.refresh();
          this.dialogRef.close();

        },
        (error) => {
          console.log("ERROR");
          this.dialogRef.close();
        }
    );
  }

  chooseEmoji(emoji: string) {
    this.newEmoji = emoji;
  }
}
