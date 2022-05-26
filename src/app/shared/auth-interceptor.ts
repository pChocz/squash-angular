import {Injectable} from '@angular/core';
import {
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
import {RouteEventsService} from './route-events.service';
import {Globals} from "../globals";
import {NotificationService} from "./notification.service";
import {MyLoggerService} from "./my-logger.service";

/**
 * Interceptor for HTTP requests. It is used to attach bearer token for
 * each request as well as to unify errors caught during HTTP requests.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    previousUrl: string;

    constructor(private notificationService: NotificationService,
                private loggerService: MyLoggerService,
                private router: Router,
                private routeEventsService: RouteEventsService) {
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
            this.loggerService.log('Sending request without token', false);
        }

        return next
            .handle(request)
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

                            // no connection
                            case 0:
                                this.router.navigate([`/login`]);
                                this.notificationService.error('error.databaseConnectionError')
                                break;

                            // bad request
                            case 400:
                                this.notificationService.error('error.code.' + error.error.message);
                                break;

                            // unauthorized
                            case 401:
                                if (error.error.message === 'INVALID_REFRESH_TOKEN'
                                    || error.error.message === 'EXPIRED_REFRESH_TOKEN') {
                                    // handling when token couldn't be refreshed
                                    this.router.navigate([`/login`], {queryParams: {returnUrl: this.previousUrl}});
                                    this.notificationService.error('login.signInFirst');
                                } else {
                                    this.notificationService.error('error.noPermission');
                                }
                                break;

                            // forbidden
                            case 403:
                                this.notificationService.error('error.accessForbidden');
                                break;

                            // not found
                            case 404:
                                this.router.navigate([`/not-found`], {
                                    skipLocationChange: true,
                                    queryParams: {
                                        message: error.error.message,
                                        status: error.error.status,
                                        frontendUrl: this.previousUrl,
                                        backendUrl: error.error.path,
                                    },
                                });
                                break;

                            // gateway timeout
                            case 504:
                                this.notificationService.error('error.offline')
                                break;

                            default:
                                this.notificationService.error('error.unexpected')
                        }
                        return throwError(() => error);
                    }
                })
            )
    }

}
