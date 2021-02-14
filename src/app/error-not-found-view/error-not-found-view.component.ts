import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-error-not-found-view',
    templateUrl: './error-not-found-view.component.html',
    styleUrls: ['./error-not-found-view.component.css'],
})
export class ErrorNotFoundViewComponent implements OnInit {

    message: string;
    backendUrl: string;
    frontendUrl: string;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private titleService: Title,
                private translateService: TranslateService) {

        this.route.queryParams.subscribe((params) => {
            if (params.message) {
                this.message = params.message;
            }
            this.backendUrl = params.backendUrl;
            this.frontendUrl = params.frontendUrl === undefined ? this.router.url : params.frontendUrl;
        });
    }

    ngOnInit(): void {
        this.translateService
            .get('error.404')
            .subscribe((translation: string) => {
                this.titleService.setTitle(translation);
            });
    }

    fixApp(): void {
        this.router.navigate([`/`]);
        setTimeout(()=>{
            window.location.reload();
        }, 100);
    }

}
