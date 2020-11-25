import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {version} from '../../package.json';
import {NgcCookieConsentService} from 'ngx-cookieconsent';
import {Subscription} from 'rxjs';
import {SwUpdate} from '@angular/service-worker';
import {PlayerDetailed} from './shared/rest-api-dto/player-detailed.model';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
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
    currentPlayerUuid: string;
    currentPlayer: PlayerDetailed;

    constructor(
        private ccService: NgcCookieConsentService,
        private matIconRegistry: MatIconRegistry,
        private domSanitizer: DomSanitizer,
        private swUpdate: SwUpdate
    ) {
        this.matIconRegistry.addSvgIcon(
            `github-mark`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/github-mark.svg')
        );

        this.matIconRegistry.addSvgIcon(
            `linkedin-mark`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/linkedin-mark.svg')
        );

        this.matIconRegistry.addSvgIcon(
            `facebook-mark`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/facebook-mark.svg')
        );

        this.matIconRegistry.addSvgIcon(
            `angular-icon`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/angular-icon.svg')
        );

        this.matIconRegistry.addSvgIcon(
            `java-icon`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/java-icon.svg')
        );

        this.matIconRegistry.addSvgIcon(
            `spring-boot-icon`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/spring-boot-icon.svg')
        );

        this.matIconRegistry.addSvgIcon(
            `postgresql-icon`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/postgresql-icon.svg')
        );

        this.matIconRegistry.addSvgIcon(
            `jenkins-icon`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/jenkins-icon.svg')
        );

        this.matIconRegistry.addSvgIcon(
            `cookie-icon`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/cookie-icon.svg')
        );

        this.matIconRegistry.addSvgIcon(
            `hibernate-icon`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/hibernate-icon.svg')
        );

        this.matIconRegistry.addSvgIcon(
            `angular-material-icon`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/angular-material-icon.svg')
        );

        this.matIconRegistry.addSvgIcon(
            `pwa-icon`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/pwa-icon.svg')
        );

        this.matIconRegistry.addSvgIcon(
            `bootstrap-icon`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/bootstrap-icon.svg')
        );

        this.matIconRegistry.addSvgIcon(
            `ovh-icon`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/ovh-icon.svg')
        );

        this.matIconRegistry.addSvgIcon(
            `lets-encrypt-icon`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/lets-encrypt-icon.svg')
        );

        this.matIconRegistry.addSvgIcon(
            `ubuntu-icon`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/ubuntu-icon.svg')
        );

        this.matIconRegistry.addSvgIcon(
            `nginx-icon`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/nginx-icon.svg')
        );

        this.matIconRegistry.addSvgIcon(
            `vaadin-icon`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/vaadin-icon.svg')
        );

        this.matIconRegistry.addSvgIcon(
            `gitlab-icon`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/gitlab-icon.svg')
        );

        this.matIconRegistry.addSvgIcon(
            `idea-icon`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/idea-icon.svg')
        );

        this.matIconRegistry.addSvgIcon(
            `vscode-icon`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/vscode-icon.svg')
        );

        this.matIconRegistry.addSvgIcon(
            `visualstudio-icon`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/visualstudio-icon.svg')
        );

        this.matIconRegistry.addSvgIcon(
            `postman-icon`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/postman-icon.svg')
        );

        this.matIconRegistry.addSvgIcon(
            `docker-icon`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/docker-icon.svg')
        );

        this.matIconRegistry.addSvgIcon(
            `maven-icon`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/maven-icon.svg')
        );

        this.matIconRegistry.addSvgIcon(
            `cup-icon`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/cup-icon.svg')
        );

        this.matIconRegistry.addSvgIcon(
            `award-icon`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/award-icon.svg')
        );

        this.matIconRegistry.addSvgIcon(
            `supercup-icon`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/supercup-icon.svg')
        );

        this.matIconRegistry.addSvgIcon(
            `100-icon`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/100-icon.svg')
        );

        this.matIconRegistry.addSvgIcon(
            `covid-icon`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/covid-icon.svg')
        );
    }

    hasToken(): boolean {
        const token: string = localStorage.getItem('token');
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
                if (confirm('New version available. Load new version?')) {
                    window.location.reload();
                }
            });
        }

        // subscribe to cookieconsent observables to react to main events
        this.popupOpenSubscription = this.ccService.popupOpen$.subscribe(() => {
            // you can use this.ccService.getConfig() to do stuff...
        });

        this.popupCloseSubscription = this.ccService.popupClose$.subscribe(() => {
            // you can use this.ccService.getConfig() to do stuff...
        });

        this.initializeSubscription = this.ccService.initialize$.subscribe(() => {
            // you can use this.ccService.getConfig() to do stuff...
        });

        this.statusChangeSubscription = this.ccService.statusChange$.subscribe(() => {
            // you can use this.ccService.getConfig() to do stuff...
        });

        this.revokeChoiceSubscription = this.ccService.revokeChoice$.subscribe(() => {
            // you can use this.ccService.getConfig() to do stuff...
        });

        this.noCookieLawSubscription = this.ccService.noCookieLaw$.subscribe(() => {
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
