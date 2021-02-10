import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
import {RouteEventsService} from './route-events.service';
import {TranslateService} from "@ngx-translate/core";

/**
 * Interceptor for HTTP requests. It is used to attach bearer token for
 * each request as well as to unify errors caught during HTTP requests.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    durationInSeconds = 7;
    previousUrl: string;

    constructor(private router: Router,
                private snackBar: MatSnackBar,
                private routeEventsService: RouteEventsService,
                private translateService: TranslateService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.previousUrl = this.routeEventsService.previousRoutePath.value;

        const bearerToken = localStorage.getItem('token');

        if (bearerToken) {
            // if token exists, it is being attached to the request on the fly
            req = req.clone({headers: req.headers.set('Authorization', bearerToken)});
        } else {
            console.log('Sending request without token');
        }

        return next.handle(req).pipe(
            catchError((err: HttpErrorResponse) => {
                switch (err.status) {
                    case 0:
                        this.handleDatabaseConnectionError();
                        break;

                    case 401:
                        this.handleUnauthorizedError(bearerToken);
                        break;

                    case 403:
                        this.handleAccessForbiddenError();
                        break;

                    case 504:
                        this.handleDisconnectedError();
                        break;

                    default:
                        this.handleGenericError(err.error);
                }
                return throwError(err);
            })
        );
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

    handleUnauthorizedError(token: string): void {
        console.log('ERROR: Not Authorized');
        this.translateService
            .get('login.signInFirst')
            .subscribe((translation: string) => {
                this.openSnackBar(translation, 'mat-warn');
            });
        if (token) {
            this.router.navigate([`/dashboard`]);
        }
    }

    handleAccessForbiddenError(): void {
        console.log('ERROR: Access Forbidden');
        this.translateService
            .get('error.accessForbidden')
            .subscribe((translation: string) => {
                this.openSnackBar(translation, 'mat-warn');
            });
    }

    handleGenericError(error: any): void {
        const message: string = '(' + error.status + ') ' + error.message;
        console.log('ERROR: ' + message);
        this.router.navigate([`/not-found`], {
            queryParams: {
                message: error.message,
                frontendUrl: this.previousUrl,
                backendUrl: error.path,
            },
        });
        this.openSnackBar(message, 'mat-warn');
    }

    openSnackBar(message: string, pannelClass: string): void {
        this.snackBar.open(message, 'X', {
            duration: this.durationInSeconds * 1000,
            panelClass: ['mat-toolbar', pannelClass],
        });
    }

}
