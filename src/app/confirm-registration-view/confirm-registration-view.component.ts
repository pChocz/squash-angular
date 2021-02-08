import {Component, OnInit, HostListener} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DomSanitizer, Title} from '@angular/platform-browser';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-confirm-registration-view',
    templateUrl: './confirm-registration-view.component.html',
    styleUrls: ['./confirm-registration-view.component.css']
})
export class ConfirmRegistrationViewComponent implements OnInit {

    status: string;
    token: string;
    validating: boolean;

    constructor(
        private http: HttpClient,
        private apiEndpointsService: ApiEndpointsService,
        private route: ActivatedRoute,
        private titleService: Title) {

    }

    ngOnInit(): void {
        this.titleService.setTitle('Confirm registration');
        this.validating = true;
        this.route.params.subscribe(params => this.token = params["token"]);
        let params = new HttpParams().set("token", this.token);

        this.http
            .post<number>(this.apiEndpointsService.getConfirmRegistration(), params)
            .subscribe(
                () => {
                    this.status = "SUCCESS";
                    this.validating = false;
                },
                (error) => {
                    this.status = "ERROR";
                    this.validating = false;
                }
            );

    }

}
