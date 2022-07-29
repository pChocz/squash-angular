import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'decimalGroupingPipe'
})
export class DecimalGroupingPipe implements PipeTransform {

    transform(value: number): string {
        if (value === null) {
            return '';
        }
        let str = value.toString();
        if (str.length >= 3) {
            str = str.replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
        }
        return str;
    }

}
