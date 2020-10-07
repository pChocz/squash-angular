import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-error-not-found-view',
    templateUrl: './error-not-found-view.component.html',
    styleUrls: ['./error-not-found-view.component.css'],
})
export class ErrorNotFoundViewComponent implements OnInit {
    message: string;
    backendUrl: string;
    frontendUrl: string;

    constructor(private router: Router, private route: ActivatedRoute, private titleService: Title) {
        this.titleService.setTitle('Error 404');

        this.route.queryParams.subscribe((params) => {
            this.message = params.message === undefined ? 'No resource found here!' : params.message;
            this.backendUrl = params.backendUrl;
            this.frontendUrl = params.frontendUrl === undefined ? this.router.url : params.frontendUrl;
        });
    }

    ngOnInit(): void {}
}
