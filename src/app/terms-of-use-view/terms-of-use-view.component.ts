import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";
import {MyLoggerService} from "../shared/my-logger.service";

@Component({
  selector: 'app-terms-of-use-view',
  templateUrl: './terms-of-use-view.component.html',
  styleUrls: ['./terms-of-use-view.component.css']
})
export class TermsOfUseViewComponent implements OnInit {

  updateDate: Date = new Date(2021, 7, 12);

  constructor(private titleService: Title,
              private loggerService: MyLoggerService,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.translateService
    .get('termsOfUse.title')
    .subscribe((translation: string) => {
      this.titleService.setTitle(translation);
      this.loggerService.log(translation);
    });
  }

}
