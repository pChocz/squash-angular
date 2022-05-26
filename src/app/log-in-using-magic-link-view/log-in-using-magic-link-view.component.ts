import {Component, OnInit} from '@angular/core';
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {MyLoggerService} from "../shared/my-logger.service";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Globals} from "../globals";
import {TokenDecodeService} from "../shared/token-decode.service";
import {NotificationService} from "../shared/notification.service";

@Component({
    selector: 'app-log-in-using-magic-link-view',
    templateUrl: './log-in-using-magic-link-view.component.html',
    styleUrls: ['./log-in-using-magic-link-view.component.css']
})
export class LogInUsingMagicLinkViewComponent implements OnInit {

    isLoading: boolean;
    token: string;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private notificationService: NotificationService,
                private http: HttpClient,
                private apiEndpointsService: ApiEndpointsService,
                private loggerService: MyLoggerService,
                private tokenDecodeService: TokenDecodeService) {
    }

    ngOnInit(): void {
        this.isLoading = true;
        this.route.params.subscribe({
            next: (params) =>
                (this.token = params.token)
        });

        const params = new HttpParams()
            .set('token', this.token)

        this.http
            .post<any>(this.apiEndpointsService.getLoginWithMagicLink(), params)
            .subscribe({
                next: (tokens) => {
                    this.loggerService.log("TOKENS: " + tokens, false);
                    const newBearerToken = tokens.jwtAccessToken;
                    const newRefreshToken = tokens.refreshToken;
                    localStorage.setItem(Globals.STORAGE_JWT_TOKEN_KEY, newBearerToken);
                    localStorage.setItem(Globals.STORAGE_REFRESH_TOKEN_KEY, newRefreshToken);
                    this.loggerService.log("Password with magic link successful. Tokens have also been set properly", false);
                    this.tokenDecodeService.refresh();
                    this.isLoading = false;
                    this.router.navigate([`/dashboard`]);
                    this.notificationService.success('loginUsingMagicLink.successLogin');
                },
                error: (error) => {
                    this.loggerService.log(error, false);
                    this.isLoading = false;
                    this.router.navigate([`/login`]);
                    this.notificationService.error('loginUsingMagicLink.failedLogin');
                }
            })

    }

}
