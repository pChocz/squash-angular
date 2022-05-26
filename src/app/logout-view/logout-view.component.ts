import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TokenDecodeService} from "../shared/token-decode.service";
import {Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";
import {Globals} from "../globals";
import {MyLoggerService} from "../shared/my-logger.service";
import {NotificationService} from "../shared/notification.service";

@Component({
    selector: 'app-logout-view',
    templateUrl: './logout-view.component.html',
    styleUrls: ['./logout-view.component.css']
})
export class LogoutViewComponent implements OnInit {

    constructor(private tokenDecodeService: TokenDecodeService,
                private router: Router,
                private loggerService: MyLoggerService,
                private notificationService: NotificationService,
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
        this.notificationService.success('logout.successful');
    }

}
