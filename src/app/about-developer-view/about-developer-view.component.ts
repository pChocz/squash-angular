import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-about-developer-view',
    templateUrl: './about-developer-view.component.html',
    styleUrls: ['./about-developer-view.component.css'],
})
export class AboutDeveloperViewComponent implements OnInit {
    constructor(private titleService: Title) {
        this.titleService.setTitle('About me');
    }

    ngOnInit(): void {}

    downloadCv(): void {
        const link = document.createElement('a');
        link.setAttribute('target', '_blank');
        link.setAttribute('href', 'http://maven.apache.org/images/sw_maj_rond.gif');
        document.body.appendChild(link);
        console.log(link);
        link.click();
        link.remove();
    }
}
