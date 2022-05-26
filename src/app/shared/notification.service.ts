import {Injectable} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";
import {MyLoggerService} from "./my-logger.service";

@Injectable()
export class NotificationService {

    durationInSeconds: number = 5;

    constructor(private translateService: TranslateService,
                private loggerService: MyLoggerService,
                private snackBar: MatSnackBar) {

    }

    error(content: string, interpolateParams?: Object): void {
        this.translateService
            .get(content, interpolateParams)
            .subscribe((translation: string) => {
                const contentToLog = 'ERROR: ' + content;
                this.loggerService.log(contentToLog, false);
                this.openSnackBar(translation, 'mat-warn');
            });
    }

    success(content: string, interpolateParams?: Object): void {
        this.translateService
            .get(content, interpolateParams)
            .subscribe((translation: string) => {
                this.openSnackBar(translation, 'mat-primary');
            });
    }

    openSnackBar(message: string, panelClass: string): void {
        this.snackBar.open(message, 'X', {
            duration: this.durationInSeconds * 1000,
            panelClass: ['mat-toolbar', panelClass],
        });
    }

}
