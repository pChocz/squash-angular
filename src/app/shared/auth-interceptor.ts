import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    durationInSeconds = 7;

    constructor(
        private router: Router,
        private snackBar: MatSnackBar,
        private location: Location) {

    }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler): Observable<HttpEvent<any>> {

        const bearerToken = localStorage.getItem("token");

        if (bearerToken) {
            req = req.clone(
                {
                    headers: req.headers.set("Authorization", bearerToken)
                }
            );

            return next.handle(req).pipe(
                catchError((err: HttpErrorResponse) => {
                    if (err.status == 401 || err.status === 403) {
                        this.handleUnauthorizedError()
                    }
                    return throwError(err);
                })
            );

        } else {
            console.log("No token - sending request without it")

            return next.handle(req).pipe(
                catchError((err: HttpErrorResponse) => {
                    if (err.status == 401 || err.status === 403) {
                        this.handleUnauthorizedError()
                    }
                    return throwError(err);
                })
            );

        }
    }

    handleUnauthorizedError(): void {
        console.log("Authorization error has been caught!");
        this.router.navigate([`/login`]);

        this.snackBar.open("You must sign in first!", "X", {
            duration: this.durationInSeconds * 1000,
            panelClass: ['mat-toolbar', 'mat-primary']
        });
    }

}