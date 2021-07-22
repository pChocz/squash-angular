import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'balancePipe'
})
export class BalancePipe implements PipeTransform {

    /**
     * Note that minus sign here is not a regular "hyphen",
     * but appropriate "minus" ASCII character (although
     * the difference is not visible in the source code).
     *
     * hyphen: -
     * minus:  −
     */
    transform(value: number): string {
        let str = value.toString();
        if (str.length >= 3) {
            str = str.replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
        }

        return value === 0
            ? str
            : value > 0
                ? '+' + str
                : '−' + str.substr(1);
    }

}
