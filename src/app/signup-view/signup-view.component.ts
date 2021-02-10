import {Component, HostListener, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Title} from '@angular/platform-browser';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-signup-view',
    templateUrl: './signup-view.component.html',
    styleUrls: ['./signup-view.component.css'],
})
export class SignupViewComponent implements OnInit {

    durationInSeconds = 7;

    emailField = new FormControl('', [
        Validators.required,
        Validators.email
    ]);

    usernameField = new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(20),
    ]);

    passwordField = new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(20),
    ]);

    hide: boolean;
    registering: boolean;

    constructor(private router: Router,
                private http: HttpClient,
                private apiEndpointsService: ApiEndpointsService,
                private snackBar: MatSnackBar,
                private titleService: Title,
                private translateService: TranslateService) {
    }

    ngOnInit(): void {
        this.translateService
            .get('signUp.title')
            .subscribe((translation: string) => {
                this.titleService.setTitle(translation);
            });

        this.hide = true;
        this.registering = false;
    }

    signup(): void {
        this.registering = true;

        const username: string = this.usernameField.value;
        const email: string = this.emailField.value;
        const password: string = this.passwordField.value;

        this.usernameField.setValue('');
        this.emailField.setValue('');
        this.passwordField.setValue('');

        const params = new HttpParams()
            .set('username', username)
            .set('email', email)
            .set('password', password)
            .set('frontendUrl', environment.frontendUrl);

        this.http
            .post<number>(this.apiEndpointsService.getSignup(), params)
            .subscribe(
                () => {
                    this.translateService
                        .get('signUp.successfull')
                        .subscribe((translation: string) => {
                            this.snackBar.open(translation, 'X', {
                                duration: this.durationInSeconds * 1000,
                                panelClass: ['mat-toolbar', 'mat-primary'],
                            });
                        });
                    this.router.navigate([`/login`]);
                },
                (error) => {
                    console.log(error);
                    this.translateService
                        .get('signUp.credentialsTaken')
                        .subscribe((translation: string) => {
                            this.snackBar.open(translation, "X", {
                                duration: this.durationInSeconds * 1000,
                                panelClass: ['mat-toolbar', 'mat-warn']
                            });
                        });
                    this.registering = false;
                    this.router.navigate([`/register`]);
                }
            );
    }

    isValidInput(): boolean {
        return (
            this.emailField.valid &&
            this.usernameField.valid &&
            this.passwordField.valid
        );
    }

    getErrorMessageForEmailField(): string {
        if (this.emailField.hasError('required')) {
            return 'fieldValidation.error.required';
        } else if (this.emailField.hasError('email')) {
            return 'fieldValidation.error.email';
        } else {
            return '';
        }
    }

    getErrorMessageForUsernameField(): string {
        if (this.usernameField.hasError('required')) {
            return 'fieldValidation.error.required';
        } else if (
            this.usernameField.hasError('minlength') ||
            this.usernameField.hasError('maxlength')
        ) {
            return 'fieldValidation.error.min5Max20';
        } else {
            return '';
        }
    }

    getErrorMessageForPasswordField(): string {
        if (this.passwordField.hasError('required')) {
            return 'fieldValidation.error.required';
        } else if (
            this.usernameField.hasError('minlength') ||
            this.usernameField.hasError('maxlength')
        ) {
            return 'fieldValidation.error.min5Max40';
        } else {
            return '';
        }
    }

    @HostListener('document:keydown', ['$event'])
    handleDeleteKeyboardEvent(event: KeyboardEvent) {
        if (event.key === 'Enter' && this.isValidInput()) {
            this.signup();
        }
    }

}
