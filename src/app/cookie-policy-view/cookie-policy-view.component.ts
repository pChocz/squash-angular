import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';

@Component({
    selector: 'app-cookie-policy-view',
    templateUrl: './cookie-policy-view.component.html',
    styleUrls: ['./cookie-policy-view.component.css']
})
export class CookiePolicyViewComponent implements OnInit {

    constructor(private titleService: Title) {
        this.titleService.setTitle('Cookie Policy');
    }

    ngOnInit(): void {
    }

}
