import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {NgcCookieConsentService} from 'ngx-cookieconsent';
import {Subscription} from 'rxjs';
import {SwUpdate} from '@angular/service-worker';
import {HttpClient} from "@angular/common/http";
import {TokenDecodeService} from "./shared/token-decode.service";
import {TranslateService} from '@ngx-translate/core';
import {OverlayContainer} from "@angular/cdk/overlay";
import {Globals} from "./globals";
import packageInfo from '../../package.json';
import {AuthService} from "./shared/auth.service";
import {environment} from "../environments/environment";
import {League} from "./shared/rest-api-dto/league.model";
import {MatDrawer} from "@angular/material/sidenav";
import {Router} from "@angular/router";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {

    version = packageInfo.version;
    title = 'squash-app-bootstrap';
    languages = ['en', 'pl'];
    defaultLanguage = 'en';
    selectedLanguage;

    @HostBinding('class') className = '';

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
                private router: Router,
                private domSanitizer: DomSanitizer,
                private auth: AuthService,
                private swUpdate: SwUpdate,
                private translateService: TranslateService,
                private overlay: OverlayContainer) {

        let cookieTheme = localStorage.getItem(Globals.STORAGE_THEME_KEY);
        if (cookieTheme === Globals.DARK_MODE) {
            this.enableDarkMode();
        } else {
            // default mode
            this.enableLightMode();
        }

        this.translateService.addLangs(this.languages);
        this.translateService.setDefaultLang(this.defaultLanguage);

        let cookieLanguage = localStorage.getItem(Globals.STORAGE_LANGUAGE_KEY);
        let browserLanguage = this.translateService.getBrowserLang();

        if (this.languages.includes(cookieLanguage)) {
            this.selectedLanguage = cookieLanguage;
        } else if (this.languages.includes(browserLanguage)) {
            this.selectedLanguage = browserLanguage;
            localStorage.setItem(Globals.STORAGE_LANGUAGE_KEY, browserLanguage);
        } else {
            this.selectedLanguage = this.defaultLanguage;
            localStorage.setItem(Globals.STORAGE_LANGUAGE_KEY, this.defaultLanguage);
        }

        this.translateService.use(this.selectedLanguage);


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
            `mongo-icon`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/mongo-icon.svg')
        );

        this.matIconRegistry.addSvgIcon(
            `redis-icon`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/redis-icon.svg')
        );

        this.matIconRegistry.addSvgIcon(
            `jenkins-icon`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/jenkins-icon.svg')
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
            `echarts-icon`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/echarts-icon.svg')
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
            `contabo-icon`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/contabo-icon.svg')
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
            `traefik-icon`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/traefik-icon.svg')
        );

        this.matIconRegistry.addSvgIcon(
            `gradle-icon`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/gradle-icon.svg')
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

        this.matIconRegistry.addSvgIcon(
            `lenny-happy-left`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/lenny-happy-left.svg')
        );

        this.matIconRegistry.addSvgIcon(
            `lenny-happy-right`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/lenny-happy-right.svg')
        );

        this.matIconRegistry.addSvgIcon(
            `lenny-sad-left`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/lenny-sad-left.svg')
        );

        this.matIconRegistry.addSvgIcon(
            `lenny-sad-right`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/lenny-sad-right.svg')
        );

        this.matIconRegistry.addSvgIcon(
            `lenny-neutral-left`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/lenny-neutral-left.svg')
        );

        this.matIconRegistry.addSvgIcon(
            `lenny-neutral-right`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/lenny-neutral-right.svg')
        );
    }

    hasToken(): boolean {
        const token: string = localStorage.getItem(Globals.STORAGE_JWT_TOKEN_KEY);
        return !!token;
    }

    ngOnInit(): void {
        // functionality to prompt user that new version is available
        if (this.swUpdate.isEnabled) {
            this.swUpdate.checkForUpdate()
                .then((isNewAvailable) => {
                    if (isNewAvailable) {
                        this.translateService
                            .get('newVersionAvailablePopup')
                            .subscribe((res: string) => {
                                if (confirm(res)) {
                                    window.location.reload();
                                }
                            });
                    }
                });
        }

        this.translateService
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
                this.ccService.getConfig().content.href = environment.frontendUrl + 'privacy-policy';
                this.ccService.getConfig().content.policy = data['cookie.policy'];

                this.ccService.destroy();//remove previous cookie bar (with default messages)
                this.ccService.init(this.ccService.getConfig()); // update config with translated messages
            });

    }

    switchTheme() {
        if (this.className === Globals.DARK_MODE) {
            this.enableLightMode();
        } else {
            this.enableDarkMode();
        }
    }

    enableLightMode() {
        this.className = 'lightMode';
        localStorage.setItem(Globals.STORAGE_THEME_KEY, Globals.LIGHT_MODE);
        this.overlay.getContainerElement().classList.add(Globals.LIGHT_MODE);
        this.overlay.getContainerElement().classList.remove(Globals.DARK_MODE);
    }

    enableDarkMode() {
        this.className = 'darkMode';
        localStorage.setItem(Globals.STORAGE_THEME_KEY, Globals.DARK_MODE);
        this.overlay.getContainerElement().classList.add(Globals.DARK_MODE);
        this.overlay.getContainerElement().classList.remove(Globals.LIGHT_MODE);
    }

    switchLang() {
        let index = this.languages.indexOf(this.selectedLanguage);
        if (index === this.languages.length - 1) {
            index = 0;
        } else {
            index = index + 1;
        }
        this.selectedLanguage = this.languages[index];
        this.translateService.use(this.selectedLanguage);
        localStorage.setItem(Globals.STORAGE_LANGUAGE_KEY, this.selectedLanguage);
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

    async extendSession() {
        let refreshToken = localStorage.getItem(Globals.STORAGE_REFRESH_TOKEN_KEY);
        await this.auth.refreshTokenPromise(refreshToken).finally(() => this.tokenDecodeService.refresh());
    }

    goToLeagueModeratorView(league: League, drawer: MatDrawer) {
        drawer.toggle();
        this.router.navigate(['/league-moderating', league.leagueUuid]);
    }

    isFullScreen(): boolean {
        return this.router.url.includes('league-match-results-distribution')
            || this.router.url.includes('league-set-results-histogram');
            // || this.router.url.includes('league-rounds');
    }

    showFooter(): boolean {
        return !this.router.url.includes('match-referee-sheet');
    }
}
