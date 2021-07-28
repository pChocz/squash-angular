import {Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {DatePipe} from "@angular/common";

@Pipe({
  name: 'localizedDate'
})
export class LocalizedDatePipe implements PipeTransform {

  constructor(private translateService: TranslateService) {
  }

  transform(value: any, pattern: string = 'dd.MM.y'): any {
    const localeCode: string = this.translateService.currentLang === 'pl'
        ? 'pl-PL'
        : 'en-GB';
    const datePipe: DatePipe = new DatePipe(localeCode);
    return datePipe.transform(value, pattern);
  }

}
