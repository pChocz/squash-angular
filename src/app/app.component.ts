import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {version} from '../../package.json';
import {NgcCookieConsentService} from 'ngx-cookieconsent';
import {Subscription} from 'rxjs';
import {SwUpdate} from '@angular/service-worker';
import {HttpClient} from "@angular/common/http";
import {TokenDecodeService} from "./shared/token-decode.service";
import {TranslateService} from '@ngx-translate/core';
import {CookieService} from 'ngx-cookie-service';
import {LanguageReloadService} from "./shared/language-reload.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {

    version = version;
    title = 'squash-app-bootstrap';
    languages = ['en', 'pl'];
    defaultLanguage = 'en';
    selectedLanguage;

    private popupOpenSubscription: Subscription;
    private popupCloseSubscription: Subscription;
    private initializeSubscription: Subscription;
    private statusChangeSubscription: Subscription;
    private revokeChoiceSubscription: Subscription;
    private noCookieLawSubscription: Subscription;

    constructor(public tokenDecodeService: TokenDecodeService,
                private http: HttpClient,
                private ccService: NgcCookieConsentService,
                private matIconRegistry: MatIconRegistry,
                private domSanitizer: DomSanitizer,
                private swUpdate: SwUpdate,
                private translate: TranslateService,
                private cookieService: CookieService,
                private languageReloadService: LanguageReloadService) {

        this.translate.addLangs(this.languages);
        this.translate.setDefaultLang(this.defaultLanguage);

        let cookieLanguage = this.cookieService.get('lang');
        let browserLanguage = this.translate.getBrowserLang();
        console.log('available languages: ' + this.languages);
        console.log('cookie language: ' + cookieLanguage);
        console.log('browser language: ' + browserLanguage);
        console.log('default language: ' + this.defaultLanguage);

        if (this.languages.includes(cookieLanguage)) {
            console.log('using cookie language: ' + cookieLanguage);
            this.selectedLanguage = cookieLanguage;
        } else if (this.languages.includes(browserLanguage)) {
            console.log('using browser language: ' + browserLanguage);
            this.selectedLanguage = browserLanguage;
        } else {
            console.log('using default language: ' + this.defaultLanguage);
            this.selectedLanguage = this.defaultLanguage;
        }

        this.translate.use(this.selectedLanguage);


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

        this.matIconRegistry.addSvgIcon(
            `flag-pl`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/pl.svg')
        );

        this.matIconRegistry.addSvgIcon(
            `flag-gb`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/gb.svg')
        );

        this.matIconRegistry.addSvgIcon(
            `flag-de`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/de.svg')
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

        this.translate
            .get(['cookie.header', 'cookie.message', 'cookie.dismiss', 'cookie.allow', 'cookie.deny', 'cookie.link', 'cookie.policy'])
            .subscribe(data => {

                this.ccService.getConfig().content = this.ccService.getConfig().content || {};
                // Override default messages with the translated ones
                this.ccService.getConfig().content.header = data['cookie.header'];
                this.ccService.getConfig().content.message = data['cookie.message'];
                this.ccService.getConfig().content.dismiss = data['cookie.dismiss'];
                this.ccService.getConfig().content.allow = data['cookie.allow'];
                this.ccService.getConfig().content.deny = data['cookie.deny'];
                this.ccService.getConfig().content.link = data['cookie.link'];
                this.ccService.getConfig().content.policy = data['cookie.policy'];

                this.ccService.destroy();//remove previous cookie bar (with default messages)
                this.ccService.init(this.ccService.getConfig()); // update config with translated messages
            });

    }

    switchLang() {
        let index = this.languages.indexOf(this.selectedLanguage);
        if (index === this.languages.length - 1) {
            index = 0;
        } else {
            index = index + 1;
        }
        this.selectedLanguage = this.languages[index];
        this.translate.use(this.selectedLanguage);
        this.cookieService.set('lang', this.selectedLanguage);
        this.languageReloadService.publishLanguageChange();
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
