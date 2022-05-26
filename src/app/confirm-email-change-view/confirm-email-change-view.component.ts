import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {ActivatedRoute} from "@angular/router";
import {MyLoggerService} from "../shared/my-logger.service";

@Component({
    selector: 'app-confirm-email-change-view',
    templateUrl: './confirm-email-change-view.component.html',
    styleUrls: ['./confirm-email-change-view.component.css']
})
export class ConfirmEmailChangeViewComponent implements OnInit {

    token: string;
    messageCode: string;

    constructor(private http: HttpClient,
                private apiEndpointsService: ApiEndpointsService,
                private loggerService: MyLoggerService,
                private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.messageCode = 'processing'
        this.route.params.subscribe(params => this.token = params['token']);
        let params = new HttpParams().set('token', this.token);

        this.http
            .post(this.apiEndpointsService.getConfirmEmailChange(), params)
            .subscribe({
                next: () => {
                    this.loggerService.log("Email changed successfully", false);
                    this.messageCode = 'myAccount.emailChangedProperly';

                },
                error: (error) => {
                    this.loggerService.log("Email change ERROR", false);
                    this.loggerService.log(error, false);
                    this.messageCode = 'myAccount.emailChangeError';
                }
            });
    }

}
