import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-about-app-view',
    templateUrl: './about-app-view.component.html',
    styleUrls: ['./about-app-view.component.css'],
})
export class AboutAppViewComponent implements OnInit {

    constructor(private titleService: Title) {
        this.titleService.setTitle('About app');
    }

    ngOnInit(): void {

    }

}
