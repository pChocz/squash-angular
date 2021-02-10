import { Component, OnInit } from '@angular/core';
import {Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-admin-panel-view',
  templateUrl: './admin-panel-view.component.html',
  styleUrls: ['./admin-panel-view.component.css']
})
export class AdminPanelViewComponent implements OnInit {

  constructor(private titleService: Title,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.translateService
        .get('adminPanel.title')
        .subscribe((translation: string) => {
          this.titleService.setTitle(translation);
        });
  }

}
