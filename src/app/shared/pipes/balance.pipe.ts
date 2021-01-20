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
        return value === 0
            ? String(value)
            : value > 0
                ? '+' + value
                : '−' + -value;
    }

}
