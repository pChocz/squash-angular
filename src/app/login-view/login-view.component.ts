import {Component, HostListener, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Title} from '@angular/platform-browser';
import {HttpBackend, HttpClient, HttpParams} from '@angular/common/http';
import {TokenDecodeService} from "../shared/token-decode.service";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-login-view',
    templateUrl: './login-view.component.html',
    styleUrls: ['./login-view.component.css'],
})
export class LoginViewComponent implements OnInit {

    durationInSeconds = 7;

    hide: boolean;
    isLoading: boolean;
    username = '';
    password = '';

    constructor(private tokenDecodeService: TokenDecodeService,
                private http: HttpClient,
                private apiEndpointsService: ApiEndpointsService,
                private handler: HttpBackend,
                private router: Router,
                private snackBar: MatSnackBar,
                private titleService: Title,
                private translateService: TranslateService) {

    }

    ngOnInit(): void {
        this.translateService
            .get('login.title')
            .subscribe((translation: string) => {
                this.titleService.setTitle(translation);
            });
        this.http = new HttpClient(this.handler);
        this.hide = true;
        this.isLoading = false;
    }

    isEmptyInput(): boolean {
        return this.username.length === 0 || this.password.length === 0;
    }

    login(): void {
        this.isLoading = true;

        const params = new HttpParams()
            .set('usernameOrEmail', this.username)
            .set('password', this.password);

        this.http
            .post<any>(this.apiEndpointsService.getLogin(), params, {
                observe: 'response' as 'body',
            })
            .subscribe(
                (result) => {

                    const jwtBearerToken: string = result.headers.get('Authorization');
                    localStorage.setItem('token', jwtBearerToken);

                    this.translateService
                        .get('login.successfull')
                        .subscribe((translation: string) => {
                            this.snackBar.open(translation, 'X', {
                                duration: this.durationInSeconds * 1000,
                                panelClass: ['mat-toolbar', 'mat-primary'],
                            });
                        });

                    this.tokenDecodeService.refresh();
                    this.router.navigate([`/dashboard`]);
                },

                (error) => {
                    this.isLoading = false;
                    this.password = '';

                    if (error.status === 0) {
                        this.translateService
                            .get('error.databaseConnectionError')
                            .subscribe((translation: string) => {
                                this.snackBar.open(translation, 'X', {
                                    duration: this.durationInSeconds * 1000,
                                    panelClass: ['mat-toolbar', 'mat-error'],
                                });
                            });

                    } else if (error.status === 401) {
                        this.translateService
                            .get('error.incorrectUsernameOrPassword')
                            .subscribe((translation: string) => {
                                this.snackBar.open(translation, 'X', {
                                    duration: this.durationInSeconds * 1000,
                                    panelClass: ['mat-toolbar', 'mat-warn'],
                                });
                            });

                    }
                    this.tokenDecodeService.refresh();
                }
            );
    }

    @HostListener('document:keydown', ['$event'])
    handleDeleteKeyboardEvent(event: KeyboardEvent) {
        if (event.key === 'Enter' && !this.isEmptyInput()) {
            this.login();
        }
    }

}
