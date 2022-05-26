import {Component, HostListener, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AbstractControl, AsyncValidatorFn, FormControl, ValidationErrors, Validators} from '@angular/forms';
import {Title} from '@angular/platform-browser';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {TranslateService} from "@ngx-translate/core";
import {CustomValidators} from "../shared/custom-validators";
import {Observable, of} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {MyErrorStateMatcher} from "../shared/error-state-matcher";
import {Globals} from "../globals";
import {MyLoggerService} from "../shared/my-logger.service";
import {NotificationService} from "../shared/notification.service";

@Component({
    selector: 'app-signup-view',
    templateUrl: './signup-view.component.html',
    styleUrls: ['./signup-view.component.css'],
})
export class SignupViewComponent implements OnInit {

    matcher = new MyErrorStateMatcher();
    hidePassword: boolean;
    hidePasswordRepeat: boolean;
    registering: boolean;

    usernameField = new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
        CustomValidators.noSpecialCharactersValidator()
    ], [
        this.usernameOrEmailTakenValidator()
    ]);

    emailField = new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.maxLength(100)
    ], [
        this.emailValidValidator()
    ]);

    passwordField = new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100),
    ], [
        this.passwordStrengthValidator()
    ]);

    passwordRepeatField = new FormControl('', [
        Validators.required,
    ], [
        this.passwordMatchValidator()
    ]);

    constructor(private router: Router,
                private http: HttpClient,
                private apiEndpointsService: ApiEndpointsService,
                private loggerService: MyLoggerService,
                private notificationService: NotificationService,
                private titleService: Title,
                private translateService: TranslateService) {
    }

    ngOnInit(): void {
        this.translateService
            .get('signUp.title')
            .subscribe((translation: string) => {
                this.titleService.setTitle(translation);
                this.loggerService.log(translation);
            });

        this.hidePassword = true;
        this.hidePasswordRepeat = true;
        this.registering = false;
    }

    signUp(): void {
        this.registering = true;

        const username: string = this.usernameField.value;
        const email: string = this.emailField.value;
        const password: string = this.passwordField.value;

        const params = new HttpParams()
            .set('username', username)
            .set('email', email)
            .set('password', password)
            .set('frontendUrl', environment.frontendUrl)
            .set('lang', localStorage.getItem(Globals.STORAGE_LANGUAGE_KEY));

        this.http
            .post<number>(this.apiEndpointsService.getSignup(), params)
            .subscribe({
                next: () => {
                    this.notificationService.success('signUp.successfull');
                    this.router.navigate([`/login`]);
                },
                error: (error) => {
                    this.loggerService.log(error, false);
                    this.notificationService.success(error.status === 406
                        ? 'signUp.credentialsNotValid'
                        : 'signUp.credentialsTaken');
                    this.router.navigate([`/register`]);
                    this.registering = false;
                }
            });
    }

    isValidInput(): boolean {
        return (
            this.emailField.valid &&
            this.usernameField.valid &&
            this.passwordField.valid &&
            this.passwordRepeatField.valid
        );
    }

    getErrorMessageForEmailField(): string {
        if (this.emailField.hasError('required')) {
            return 'fieldValidation.error.required';

        } else if (this.emailField.hasError('email')) {
            return 'fieldValidation.error.email';

        } else if (this.emailField.hasError('emailInvalid')) {
            return 'fieldValidation.error.emailInvalid';

        } else {
            return '';
        }
    }

    getErrorMessageForUsernameField(): string {
        if (this.usernameField.hasError('required')) {
            return 'fieldValidation.error.required';

        } else if (this.usernameField.hasError('noSpecialCharacters')) {
            return 'fieldValidation.error.noSpecialCharactersAllowed';

        } else if (this.usernameField.hasError('usernameOrEmailTaken')) {
            return 'fieldValidation.error.nameTaken';

        } else if (
            this.usernameField.hasError('minlength') ||
            this.usernameField.hasError('maxlength')) {
            return 'fieldValidation.error.min5Max30';

        } else {
            return '';
        }
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
        if (event.key === 'Enter' && this.isValidInput() && !this.registering) {
            this.signUp();
        }
    }

    usernameOrEmailTakenValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            return this.http
                .get<boolean>(this.apiEndpointsService.getCheckUsernameOrEmailTaken(control.value))
                .pipe(
                    map(result => result ? {usernameOrEmailTaken: {value: control.value}} : null),
                    catchError(() => of(null))
                )
        };
    }

    emailValidValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            return this.http
                .get<boolean>(this.apiEndpointsService.getCheckEmailValid(control.value))
                .pipe(
                    map(result => result ? null : {emailInvalid: {value: control.value}}),
                    catchError(() => of(null))
                )
        };
    }

    passwordStrengthValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            return this.http
                .post<boolean>(this.apiEndpointsService.getCheckPasswordStrength(),
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

    passwordMatchValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            if (control.value === this.passwordField.value) {
                return of(null);
            } else {
                return of({doesNotMatch: {value: control.value}});
            }
        };
    }

}
