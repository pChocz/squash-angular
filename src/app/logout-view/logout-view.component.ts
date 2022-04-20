import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpClient} from '@angular/common/http';
import {TokenDecodeService} from "../shared/token-decode.service";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";
import {Globals} from "../globals";
import {MyLoggerService} from "../shared/my-logger.service";

@Component({
    selector: 'app-logout-view',
    templateUrl: './logout-view.component.html',
    styleUrls: ['./logout-view.component.css']
})
export class LogoutViewComponent implements OnInit {

    durationInSeconds = 7;

    constructor(private tokenDecodeService: TokenDecodeService,
                private http: HttpClient,
                private apiEndpointsService: ApiEndpointsService,
                private router: Router,
                private loggerService: MyLoggerService,
                private snackBar: MatSnackBar,
                private titleService: Title,
                private translateService: TranslateService) {

    }

    ngOnInit(): void {
        this.translateService
            .get('logout.title')
            .subscribe((translation: string) => {
                this.titleService.setTitle(translation);
                this.loggerService.log(translation);
            });

        localStorage.removeItem(Globals.STORAGE_JWT_TOKEN_KEY);
        localStorage.removeItem(Globals.STORAGE_REFRESH_TOKEN_KEY);

        this.tokenDecodeService.refresh();

        this.router.navigate([`/login`]);

        this.translateService
            .get('logout.successful')
            .subscribe((translation: string) => {
                this.snackBar.open(translation, "X", {
                    duration: this.durationInSeconds * 1000,
                    panelClass: ['mat-toolbar', 'mat-primary']
                });
            });

    }

}
