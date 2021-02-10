import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-not-found-message',
    templateUrl: './not-found-message.component.html',
    styleUrls: ['./not-found-message.component.css']
})
export class NotFoundMessageComponent implements OnInit {

    @Input() message: string;

    constructor() {
    }

    ngOnInit(): void {
    }

}
