import {Injectable} from '@angular/core';
import {
    HttpClient,
    HttpErrorResponse,
    HttpHandler,
    HttpHeaderResponse,
    HttpInterceptor,
    HttpProgressEvent,
    HttpRequest,
    HttpResponse,
    HttpSentEvent,
    HttpUserEvent
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {catchError, tap} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
import {RouteEventsService} from './route-events.service';
import {TranslateService} from "@ngx-translate/core";
import {AuthService} from "./auth.service";
import {ApiEndpointsService} from "./api-endpoints.service";
import {Globals} from "../globals";
import {MatDialog} from "@angular/material/dialog";

/**
 * Interceptor for HTTP requests. It is used to attach bearer token for
 * each request as well as to unify errors caught during HTTP requests.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    durationInSeconds = 7;
    previousUrl: string;

    constructor(private http: HttpClient,
                private apiEndpointsService: ApiEndpointsService,
                private router: Router,
                private dialog: MatDialog,
                private snackBar: MatSnackBar,
                private routeEventsService: RouteEventsService,
                private translateService: TranslateService,
                private authService: AuthService) {
        this.previousUrl = routeEventsService.previousRoutePath.getValue();
    }

    private static addTokenHeader(request: HttpRequest<any>, bearerToken: string): HttpRequest<any> {
        return request.clone(
            {headers: request.headers.set(Globals.JWT_TOKEN_HEADER, bearerToken)}
        );
    }

    intercept(request: HttpRequest<any>, next: HttpHandler):
        Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {

        const currentBearerToken = localStorage.getItem(Globals.STORAGE_JWT_TOKEN_KEY);

        if (currentBearerToken) {
            // if token exists, it is being attached to the request on the fly
            request = AuthInterceptor.addTokenHeader(request, currentBearerToken);
        } else {
            console.log('Sending request without token');
        }

        return next.handle(request)
            .pipe(
                tap(event => {
                    if (event instanceof HttpResponse) {
                        return event;
                    }
                }),

                catchError(error => {
                    if (error instanceof HttpErrorResponse) {
                        // catch different types of errors
                        switch (error.status) {
                            case 0:
                                this.handleDatabaseConnectionError();
                                break;
                            case 400:
                                this.handleBadRequestError(error.error);
                                break;
                            case 401:
                                this.handleUnauthorizedError();
                                break;
                            case 403:
                                this.handleAccessForbiddenError();
                                break;
                            case 404:
                                this.handleNotFoundError(error.error);
                                break;
                            case 504:
                                this.handleDisconnectedError();
                                break;
                            default:
                                this.handleOtherError(error.error);
                        }
                        return throwError(error);
                    }
                })
            )
    }

    handleDisconnectedError(): void {
        console.log('ERROR: Either you are offline or our server');
        this.translateService
            .get('error.offline')
            .subscribe((translation: string) => {
                this.openSnackBar(translation, 'mat-warn');
            });
    }

    handleDatabaseConnectionError(): void {
        console.log('ERROR: Database connection error');
        this.router.navigate([`/login`]);
        this.translateService
            .get('error.databaseConnectionError')
            .subscribe((translation: string) => {
                this.openSnackBar(translation, 'mat-warn');
            });
    }

    handleUnauthorizedError(): void {
        console.log('ERROR: Not Authorized');
        this.translateService
            .get('login.signInFirst')
            .subscribe((translation: string) => {
                this.openSnackBar(translation, 'mat-warn');
            });
        this.router.navigate([`/login`], {queryParams: {returnUrl: this.previousUrl}});
    }

    handleAccessForbiddenError(): void {
        console.log('ERROR: Access Forbidden');
        this.translateService
            .get('error.accessForbidden')
            .subscribe((translation: string) => {
                this.openSnackBar(translation, 'mat-warn');
            });
    }

    handleNotFoundError(error: any): void {
        this.router.navigate([`/not-found`], {
            skipLocationChange: true,
            queryParams: {
                message: error.message,
                status: error.status,
                frontendUrl: this.previousUrl,
                backendUrl: error.path,
            },
        });
    }

    handleBadRequestError(error: any): void {
        console.log('ERROR: Bad Request');
        this.translateService
            .get('error.code.' + error.message)
            .subscribe((translation: string) => {
                this.openSnackBar(translation, 'mat-warn');
            });
    }

    handleOtherError(error: any): void {
        const message: string = '(' + error.status + ') ' + error.message;
        console.log('ERROR: ' + message);
        this.openSnackBar(message, 'mat-warn');
    }

    openSnackBar(message: string, pannelClass: string): void {
        this.snackBar.open(message, 'X', {
            duration: this.durationInSeconds * 1000,
            panelClass: ['mat-toolbar', pannelClass],
        });
    }

}
