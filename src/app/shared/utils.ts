import {formatDate} from "@angular/common";

export class Utils {

    constructor() {
    }

    public formatDate(date: Date): string {
        return formatDate(date, 'dd.MM.yyyy', 'en-US');
    }

    numberSeparated(number: number): string {
        return number
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

}
