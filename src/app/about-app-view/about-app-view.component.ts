import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {TranslateService} from "@ngx-translate/core";
import {MyLoggerService} from "../shared/my-logger.service";

@Component({
    selector: 'app-about-app-view',
    templateUrl: './about-app-view.component.html',
    styleUrls: ['./about-app-view.component.css'],
})
export class AboutAppViewComponent implements OnInit {

    constructor(private titleService: Title,
                private loggerService: MyLoggerService,
                private translateService: TranslateService) {
    }

    ngOnInit(): void {
        this.translateService
            .get('aboutApp.title')
            .subscribe({
                next: (translation: string) => {
                    this.titleService.setTitle(translation);
                    this.loggerService.log(translation);
                }
            });
    }

}
