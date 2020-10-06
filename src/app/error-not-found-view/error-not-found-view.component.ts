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
    path: string;

    constructor(private router: Router, private route: ActivatedRoute, private titleService: Title) {
        this.titleService.setTitle('Error 404');

        this.route.queryParams.subscribe((params) => {
            this.message = params.message === undefined ? 'No resource found here!' : params.message;
            this.path = params.path === undefined ? this.router.url : params.path;
        });
    }

    ngOnInit(): void {}
}
