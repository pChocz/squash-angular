import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-before-login-other-actions',
    templateUrl: './before-login-other-actions.component.html',
    styleUrls: ['./before-login-other-actions.component.css']
})
export class BeforeLoginOtherActionsComponent implements OnInit {

    @Input() login: boolean = true;
    @Input() magicLinkLogin: boolean = true;
    @Input() resendVerificationLink: boolean = true;
    @Input() signUp: boolean = true;
    @Input() passwordReset: boolean = true;
    @Input() buyBeer: boolean = true;

    constructor() {

    }

    ngOnInit(): void {
    }

}
