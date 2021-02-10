import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-about-app-view',
    templateUrl: './about-app-view.component.html',
    styleUrls: ['./about-app-view.component.css'],
})
export class AboutAppViewComponent implements OnInit {

    constructor(private titleService: Title,
                private translateService: TranslateService) {
    }

    ngOnInit(): void {
        this.translateService
            .get('aboutApp.title')
            .subscribe((translation: string) => {
                this.titleService.setTitle(translation);
            });
    }

}
