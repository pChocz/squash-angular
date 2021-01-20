import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { HttpParams, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {ApiEndpointsService} from "../shared/api-endpoints.service";

@Component({
    selector: 'app-signup-view',
    templateUrl: './signup-view.component.html',
    styleUrls: ['./signup-view.component.css'],
})
export class SignupViewComponent implements OnInit {
    messageCredentialsTaken = 'Username and/or email is already taken.';

    messageSuccessfullSignup =
        'Great! We have registered an account for provided credentials and sent an activation message to you.';

    loadingMessage = 'Signing up';

    durationInSeconds = 7;

    emailField = new FormControl('', [Validators.required, Validators.email]);

    usernameField = new FormControl('', [
        Validators.required,
        Validators.maxLength(20),
        Validators.minLength(5),
    ]);

    passwordField = new FormControl('', [
        Validators.required,
        Validators.minLength(5),
    ]);

    hide: boolean;
    registering: boolean;

    constructor(
        private router: Router,
        private http: HttpClient,
        private apiEndpointsService: ApiEndpointsService,
        private snackBar: MatSnackBar,
        private titleService: Title
    ) {}

    ngOnInit(): void {
        this.titleService.setTitle('Sign up');
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
                    this.snackBar.open(this.messageSuccessfullSignup, 'X', {
                        duration: this.durationInSeconds * 1000,
                        panelClass: ['mat-toolbar', 'mat-primary'],
                    });
                    this.router.navigate([`/login`]);
                },
                (error) => {
                    // this.snackBar.open(this.messageCredentialsTaken, "X", {
                    //   duration: this.durationInSeconds * 1000,
                    //   panelClass: ['mat-toolbar', 'mat-warn']
                    // });
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
            return 'You must enter a value';
        } else if (this.emailField.hasError('email')) {
            return 'Not a valid email';
        } else {
            return '';
        }
    }

    getErrorMessageForUsernameField(): string {
        if (this.usernameField.hasError('required')) {
            return 'You must enter a value';
        } else if (
            this.usernameField.hasError('minlength') ||
            this.usernameField.hasError('maxlength')
        ) {
            return '5-20 characters';
        } else {
            return '';
        }
    }

    getErrorMessageForPasswordField(): string {
        if (this.passwordField.hasError('required')) {
            return 'You must enter a value';
        } else if (this.passwordField.hasError('pattern')) {
            return 'min 5 characters';
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
