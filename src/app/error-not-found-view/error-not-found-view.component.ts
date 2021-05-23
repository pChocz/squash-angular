import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from "@ngx-translate/core";
import {environment} from 'src/environments/environment';

@Component({
    selector: 'app-error-not-found-view',
    templateUrl: './error-not-found-view.component.html',
    styleUrls: ['./error-not-found-view.component.css'],
})
export class ErrorNotFoundViewComponent implements OnInit {

    message: string;
    status: number;
    backendUrl: string;
    frontendUrl: string;
    apiUrl: string
    appAddress: string

    constructor(private router: Router,
                private route: ActivatedRoute,
                private titleService: Title,
                private translateService: TranslateService) {

        this.apiUrl = environment.apiUrl.slice(0, -1);
        this.appAddress = environment.frontendUrl.slice(0, -1);

        this.route.queryParams.subscribe((params) => {
            if (params.message) {
                this.message = params.message;
            }
            this.backendUrl = params.backendUrl;
            this.frontendUrl = params.frontendUrl === undefined ? this.router.url : params.frontendUrl;
            this.status = params.status === undefined ? 404 : params.status;
        });
    }

    ngOnInit(): void {
        this.translateService
            .get('error.title')
            .subscribe((translation: string) => {
                this.titleService.setTitle(translation + ' ' + this.status);
            });
    }

    fixApp(): void {
        this.router.navigate([`/`]);
        setTimeout(() => {
            window.location.reload();
        }, 100);
    }

}
