import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'roundGroupNumberToLetter'
})
export class RoundGroupNumberToLetterPipe implements PipeTransform {

    transform(roundNumber: number): string {
        return String.fromCharCode(64 + roundNumber);
    }

}
