import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-about-developer-view',
    templateUrl: './about-developer-view.component.html',
    styleUrls: ['./about-developer-view.component.css'],
})
export class AboutDeveloperViewComponent implements OnInit {
    constructor(private titleService: Title) {
        this.titleService.setTitle('About developer');
    }

    ngOnInit(): void {}
}
