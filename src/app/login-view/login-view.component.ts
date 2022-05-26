import {Component, HostListener, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {HttpBackend, HttpClient, HttpParams} from '@angular/common/http';
import {TokenDecodeService} from "../shared/token-decode.service";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {TranslateService} from "@ngx-translate/core";
import {Globals} from "../globals";
import {MyLoggerService} from "../shared/my-logger.service";
import {NotificationService} from "../shared/notification.service";

@Component({
    selector: 'app-login-view',
    templateUrl: './login-view.component.html',
    styleUrls: ['./login-view.component.css'],
})
export class LoginViewComponent implements OnInit {

    hide: boolean;
    isLoading: boolean;
    username = '';
    password = '';

    returnUrl: string;

    constructor(private tokenDecodeService: TokenDecodeService,
                private http: HttpClient,
                private apiEndpointsService: ApiEndpointsService,
                private handler: HttpBackend,
                private loggerService: MyLoggerService,
                private route: ActivatedRoute,
                private router: Router,
                private notificationService: NotificationService,
                private titleService: Title,
                private translateService: TranslateService) {

    }

    ngOnInit(): void {
        this.translateService
            .get('login.title')
            .subscribe((translation: string) => {
                this.titleService.setTitle(translation);
                this.loggerService.log(translation);
            });
        this.http = new HttpClient(this.handler);
        this.hide = true;
        this.isLoading = false;

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
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
                    const newBearerToken: string = result.headers.get(Globals.JWT_TOKEN_HEADER);
                    const newRefreshToken: string = result.headers.get(Globals.REFRESH_TOKEN_HEADER);

                    localStorage.setItem(Globals.STORAGE_JWT_TOKEN_KEY, newBearerToken);
                    localStorage.setItem(Globals.STORAGE_REFRESH_TOKEN_KEY, newRefreshToken);

                    this.notificationService.success('login.successfull');
                    this.tokenDecodeService.refresh();
                    this.router.navigateByUrl(this.returnUrl);
                },

                (error) => {
                    this.isLoading = false;
                    this.password = '';

                    if (error.status === 0) {
                        this.notificationService.error('error.databaseConnectionError');
                    } else if (error.status === 401) {
                        this.notificationService.error('error.incorrectUsernameOrPassword');
                    }
                    this.tokenDecodeService.refresh();
                }
            );
    }

    @HostListener('document:keydown', ['$event'])
    handleDeleteKeyboardEvent(event: KeyboardEvent) {
        if (event.key === 'Enter' && !this.isEmptyInput() && !this.isLoading) {
            this.login();
        }
    }

}
