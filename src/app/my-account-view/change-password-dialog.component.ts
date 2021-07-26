import {Component, HostListener} from "@angular/core";
import {MatDialogRef} from "@angular/material/dialog";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {FormControl, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
})
export class ChangePasswordDialogComponent {

  oldPassword: string = '';
  newPasswordRepeat: string = '';

  hideOldPassword: boolean;
  hideNewPassword: boolean;
  hideNewPasswordRepeat: boolean;

  passwordField = new FormControl('', [
    Validators.required,
    Validators.minLength(5),
    Validators.maxLength(100),
  ]);

  constructor(
      private router: Router,
      private http: HttpClient,
      private snackBar: MatSnackBar,
      private translateService: TranslateService,
      private apiEndpointsService: ApiEndpointsService,
      private dialogRef: MatDialogRef<ChangePasswordDialogComponent>) {

    this.hideOldPassword = true;
    this.hideNewPassword = true;
    this.hideNewPasswordRepeat = true;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  passwordMatches(): boolean {
    return this.passwordField.valid
        && this.passwordField.value === this.newPasswordRepeat;
  }

  onConfirmClick(): void {

    this.http
    .put(this.apiEndpointsService.getChangeMyPassword(),
        {},
        {
          params: {
            oldPassword: this.oldPassword,
            newPassword: this.passwordField.value
          },
        }
    )
    .subscribe(
        () => {
          console.log("Password changed succesfully");
          this.dialogRef.close();
          this.router.navigate(['logout']);
        },
        (error) => {
          console.log("Password change ERROR");
          this.translateService
          .get('myAccount.passwordDoesNotMatch')
          .subscribe((translation: string) => {
            this.snackBar.open(translation, "X", {
              duration: 7 * 1000,
              panelClass: ['mat-toolbar', 'mat-warn']
            });
          });
        }
    );

  }

  getErrorMessageForPasswordField(): string {
    if (this.passwordField.hasError('required')) {
      return 'fieldValidation.error.required';
    } else if (
        this.passwordField.hasError('minlength') ||
        this.passwordField.hasError('maxlength')
    ) {
      return 'fieldValidation.error.min5Max100';
    } else {
      return '';
    }
  }


  @HostListener('document:keydown', ['$event'])
  handleDeleteKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.passwordMatches()) {
      this.onConfirmClick();
    }
  }

}