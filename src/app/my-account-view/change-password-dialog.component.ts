import {Component, HostListener} from "@angular/core";
import {MatDialogRef} from "@angular/material/dialog";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {AbstractControl, AsyncValidatorFn, FormControl, ValidationErrors, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";
import {Globals} from "../globals";
import {AuthService} from "../shared/auth.service";
import {TokenDecodeService} from "../shared/token-decode.service";
import {Observable, of} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {MyErrorStateMatcher} from "../shared/error-state-matcher";

@Component({
    selector: 'app-change-password-dialog',
    templateUrl: './change-password-dialog.component.html',
})
export class ChangePasswordDialogComponent {

    matcher = new MyErrorStateMatcher();


    changingPassword = false;

    oldPassword: string = '';
    newPasswordRepeat: string = '';

    hideOldPassword: boolean;
    hideNewPassword: boolean;
    hideNewPasswordRepeat: boolean;

    passwordField = new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100),
    ], [
        this.passwordStrengthValidator()
    ]);

    constructor(private router: Router,
                private http: HttpClient,
                private snackBar: MatSnackBar,
                private tokenDecodeService: TokenDecodeService,
                private auth: AuthService,
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
        this.changingPassword = true;

        this.http
            .put<any>(this.apiEndpointsService.getChangeMyPassword(),
                {},
                {
                    params: {
                        oldPassword: this.oldPassword,
                        newPassword: this.passwordField.value
                    },
                }
            )
            .subscribe(
                tokens => {
                    const newBearerToken = tokens.jwtAccessToken;
                    const newRefreshToken = tokens.refreshToken;
                    localStorage.setItem(Globals.STORAGE_JWT_TOKEN_KEY, newBearerToken);
                    localStorage.setItem(Globals.STORAGE_REFRESH_TOKEN_KEY, newRefreshToken);
                    console.log("Password changed succesfully. Tokens have also been changed");

                    this.tokenDecodeService.refresh();

                    this.dialogRef.close();

                    this.changingPassword = false;
                    this.translateService
                        .get('myAccount.passwordChangedSuccess')
                        .subscribe((translation: string) => {
                            this.snackBar.open(translation, "X", {
                                duration: 7 * 1000,
                                panelClass: ['mat-toolbar', 'mat-primary']
                            });
                        });
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
                    this.changingPassword = false;
                }
            );
    }

    getErrorMessageForPasswordField(): string {
        if (this.passwordField.hasError('required')) {
            return 'fieldValidation.error.required';

        } else if (
            this.passwordField.hasError('minlength') ||
            this.passwordField.hasError('maxlength')) {
            return 'fieldValidation.error.min5Max100';

        } else if (
            this.passwordField.hasError('commonPassword')) {
            return 'fieldValidation.error.commonPassword';

        } else {
            return '';
        }
    }

    @HostListener('document:keydown', ['$event'])
    handleDeleteKeyboardEvent(event: KeyboardEvent) {
        if (event.key === 'Enter' && this.passwordMatches() && !this.changingPassword) {
            this.onConfirmClick();
        }
    }

    passwordStrengthValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            return this.http
                .post<Boolean>(this.apiEndpointsService.getCheckPasswordStrength(),
                    {},
                    {
                        params: {
                            password: control.value
                        },
                    })
                .pipe(
                    map(result => result ? {commonPassword: {value: control.value}} : null),
                    catchError(() => of(null))
                )
        };
    }

}
