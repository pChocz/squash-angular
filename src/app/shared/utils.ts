import {formatDate} from "@angular/common";

export class Utils {

    constructor() {
    }

    public formatDate(date: Date): string {
        return formatDate(date, 'dd.MM.yyyy', 'en-US');
    }

}
