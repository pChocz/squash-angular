import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from '@angular/platform-browser';
import { version } from '../../package.json';
import { NgcCookieConsentModule, NgcInitializeEvent, NgcStatusChangeEvent, NgcNoCookieLawEvent, NgcCookieConsentService } from 'ngx-cookieconsent';
import { Subscription } from 'rxjs';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  private popupOpenSubscription: Subscription;
  private popupCloseSubscription: Subscription;
  private initializeSubscription: Subscription;
  private statusChangeSubscription: Subscription;
  private revokeChoiceSubscription: Subscription;
  private noCookieLawSubscription: Subscription;

  version = version;
  title = 'squash-app-bootstrap';

  constructor(
    private ccService: NgcCookieConsentService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private swUpdate: SwUpdate) {

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

    this.matIconRegistry.addSvgIcon(
      `postgresql-icon`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/img/postgresql-icon.svg")
    );

    this.matIconRegistry.addSvgIcon(
      `jenkins-icon`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/img/jenkins-icon.svg")
    );

    this.matIconRegistry.addSvgIcon(
      `cookie-icon`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/img/cookie-icon.svg")
    );

  }

  hasToken(): boolean {
    let token: string = localStorage.getItem("token");
    if (token) {
      return true;
    } else {
      return false;
    }
  }


  ngOnInit(): void {

    // functionality to prompt user that new version is available
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        if (confirm("New version available. Load new version?")) {
          window.location.reload();
        }
      });
    }

    // subscribe to cookieconsent observables to react to main events
    this.popupOpenSubscription = this.ccService.popupOpen$.subscribe(
      () => {
        // you can use this.ccService.getConfig() to do stuff...
      });

    this.popupCloseSubscription = this.ccService.popupClose$.subscribe(
      () => {
        // you can use this.ccService.getConfig() to do stuff...
      });

    this.initializeSubscription = this.ccService.initialize$.subscribe(
      (event: NgcInitializeEvent) => {
        // you can use this.ccService.getConfig() to do stuff...
      });

    this.statusChangeSubscription = this.ccService.statusChange$.subscribe(
      (event: NgcStatusChangeEvent) => {
        // you can use this.ccService.getConfig() to do stuff...
      });

    this.revokeChoiceSubscription = this.ccService.revokeChoice$.subscribe(
      () => {
        // you can use this.ccService.getConfig() to do stuff...
      });

    this.noCookieLawSubscription = this.ccService.noCookieLaw$.subscribe(
      (event: NgcNoCookieLawEvent) => {
        // you can use this.ccService.getConfig() to do stuff...
      });
  }

  ngOnDestroy() {
    // unsubscribe to cookieconsent observables to prevent memory leaks
    this.popupOpenSubscription.unsubscribe();
    this.popupCloseSubscription.unsubscribe();
    this.initializeSubscription.unsubscribe();
    this.statusChangeSubscription.unsubscribe();
    this.revokeChoiceSubscription.unsubscribe();
    this.noCookieLawSubscription.unsubscribe();
  }

}
