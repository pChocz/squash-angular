import { Component } from '@angular/core';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  version = "0.0.1-SNAPSHOT";
  title = 'squash-app-bootstrap';

  constructor(private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer) {

    this.matIconRegistry.addSvgIcon(
      `github-mark`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/img/github-mark.svg")
    );

    this.matIconRegistry.addSvgIcon(
      `linkedin-mark`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/img/linkedin-mark.svg")
    );

    this.matIconRegistry.addSvgIcon(
      `facebook-mark`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/img/facebook-mark.svg")
    );

    this.matIconRegistry.addSvgIcon(
      `angular-icon`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/img/angular-icon.svg")
    );

    this.matIconRegistry.addSvgIcon(
      `java-icon`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/img/java-icon.svg")
    );

    this.matIconRegistry.addSvgIcon(
      `spring-boot-icon`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/img/spring-boot-icon.svg")
    );

  }
}
