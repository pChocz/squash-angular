import {Component, OnInit} from '@angular/core';
import {AuthService} from "../shared/auth.service";
import {Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-home-view',
    templateUrl: './home-view.component.html',
    styleUrls: ['./home-view.component.css']
})
export class HomeViewComponent implements OnInit {

    constructor(private authService: AuthService,
                private router: Router,
                private titleService: Title,
                private translateService: TranslateService) {

    }

    ngOnInit(): void {
        this.titleService.setTitle('Squash App');
        console.log('Navigated to home');

        if (this.authService.hasAnyToken() && this.authService.isUser()) {
            this.router.navigate([`/dashboard`]);
        } else {
            console.log('Navigating to login');
            this.router.navigate([`/login`]);
        }
    }

}
