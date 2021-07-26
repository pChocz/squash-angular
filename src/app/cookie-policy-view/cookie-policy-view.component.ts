import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-cookie-policy-view',
  templateUrl: './cookie-policy-view.component.html',
  styleUrls: ['./cookie-policy-view.component.css']
})
export class CookiePolicyViewComponent implements OnInit {

  constructor(private titleService: Title,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.translateService
    .get('cookiePolicy.title')
    .subscribe((translation: string) => {
      this.titleService.setTitle(translation);
    });
  }

}
