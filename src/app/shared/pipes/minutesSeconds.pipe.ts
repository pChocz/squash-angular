import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'minutesSeconds'
})
export class MinutesSecondsPipe implements PipeTransform {

    transform(millis: number): string {
        let temp = Math.floor(millis / 1000);
        const hours: number = Math.floor(temp / 3600);
        temp = temp - hours * 3600;
        const minutes: number = Math.floor(temp / 60);
        temp = temp - minutes * 60
        const seconds: number = temp;
        const hoursPadded: string = hours > 10 ? hours.toString() : '0' + hours.toString();
        const minutesPadded: string = minutes > 10 ? minutes.toString() : '0' + minutes.toString();
        const secondsPadded: string = seconds > 10 ? seconds.toString() : '0' + seconds.toString();
        let ret: string = '';
        if (hours !== 0) {
            ret += hoursPadded + 'h';
        }
        if (minutes !== 0) {
            ret += minutesPadded + 'm';
        }
        if (seconds !== 0) {
            ret += secondsPadded + 's';
        }
        return ret;
    }

}
