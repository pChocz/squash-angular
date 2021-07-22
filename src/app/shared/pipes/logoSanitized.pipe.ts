import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Pipe({
  name: 'logoSanitizedPipe'
})
export class LogoSanitizedPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {

  }

  transform(logoBytes: string): SafeResourceUrl {
    let logo: string = 'data:Image/*;base64,' + logoBytes;
    return this.sanitizer.bypassSecurityTrustResourceUrl(logo);
  }

}
