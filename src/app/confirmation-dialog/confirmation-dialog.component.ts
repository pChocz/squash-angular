import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
    selector: 'app-confirmation-dialog',
    templateUrl: './confirmation-dialog.component.html'
})
export class ConfirmationDialogComponent implements OnInit {

    constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string, isRemoval: boolean }) {

    }

    ngOnInit(): void {

    }

}
