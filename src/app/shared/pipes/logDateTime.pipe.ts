import {Pipe, PipeTransform} from '@angular/core';
import {DatePipe} from "@angular/common";

@Pipe({
    name: 'logDateTime'
})
export class LogDateTimePipe implements PipeTransform {

    constructor() {
    }

    transform(value: any): any {
        return new DatePipe('en-GB').transform(value, 'YYYY-MM-dd @ HH:mm');
    }

}
