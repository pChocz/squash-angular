import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";
import {MyLoggerService} from "../shared/my-logger.service";

@Component({
    selector: 'app-gdpr-policy-view',
    templateUrl: './gdpr-policy-view.component.html',
    styleUrls: ['./gdpr-policy-view.component.css']
})
export class GdprPolicyViewComponent implements OnInit {

    updateDate: Date = new Date(2021, 7, 12);

    constructor(private titleService: Title,
                private loggerService: MyLoggerService,
                private translateService: TranslateService) {
    }

    ngOnInit(): void {
        this.translateService
            .get('gdprPolicy.title')
            .subscribe((translation: string) => {
                this.titleService.setTitle(translation);
                this.loggerService.log(translation);
            });
    }

}
