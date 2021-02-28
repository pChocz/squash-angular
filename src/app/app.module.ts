// angular core
import "reflect-metadata";
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateCompiler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

// angular material
import {MatSelectModule} from '@angular/material/select';
import {MatSliderModule} from '@angular/material/slider';
import {MatRadioModule} from '@angular/material/radio';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatChipsModule} from '@angular/material/chips';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSortModule} from '@angular/material/sort';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatMenuModule} from '@angular/material/menu';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialogModule} from "@angular/material/dialog";

// google charts
import {GoogleChartsModule} from 'angular-google-charts';

// app components
import {XpPointsViewComponent} from './xp-points-view/xp-points-view.component';
import {SeasonViewComponent} from './season-view/season-view.component';
import {RoundViewComponent} from './round-view/round-view.component';
import {RoundGroupMatchesComponent} from './round-view/round-group-matches/round-group-matches.component';
import {RoundGroupScoreboardComponent} from './round-view/round-group-scoreboard/round-group-scoreboard.component';
import {AllLeaguesViewComponent} from './all-leagues-view/all-leagues-view.component';
import {LeaguePlayersComponent} from './league-players/league-players.component';
import {PlayersScoreboardComponent} from './league-players/players-scoreboard/players-scoreboard.component';
import {PlayersMatchesComponent} from './league-players/players-matches/players-matches.component';
import {NewRoundViewComponent} from './new-round-view/new-round-view.component';
import {AboutAppViewComponent} from './about-app-view/about-app-view.component';
import {LoginViewComponent} from './login-view/login-view.component';
import {SignupViewComponent} from './signup-view/signup-view.component';
import {ForgotPasswordViewComponent} from './forgot-password-view/forgot-password-view.component';
import {LogoutViewComponent} from './logout-view/logout-view.component';
import {ResetPasswordViewComponent} from './reset-password-view/reset-password-view.component';
import {RoundGroupMatchesEditableComponent} from './round-view-edit/round-group-matches-editable/round-group-matches-editable.component';
import {RoundViewEditComponent} from './round-view-edit/round-view-edit.component';
import {AuthInterceptor} from './shared/auth-interceptor';
import {NgcCookieConsentConfig, NgcCookieConsentModule} from 'ngx-cookieconsent';
import {environment} from 'src/environments/environment';
import {CookiePolicyViewComponent} from './cookie-policy-view/cookie-policy-view.component';
import {LeagueStatsViewComponent} from './league-stats-view/league-stats-view.component';
import {LeagueScoreboardComponent} from './league-stats-view/league-scoreboard/league-scoreboard.component';
import {HallOfFameComponent} from './league-stats-view/hall-of-fame/hall-of-fame.component';
import {OveralStatsComponent} from './league-stats-view/overal-stats/overal-stats.component';
import {PerSeasonStatsComponent} from './league-stats-view/per-season-stats/per-season-stats.component';
import {SeasonScoreboardTableComponent} from './season-view/season-scoreboard-table/season-scoreboard-table.component';
import {SeasonBalancesTableComponent} from './season-view/season-balances-table/season-balances-table.component';
import {ConfirmRegistrationViewComponent} from './confirm-registration-view/confirm-registration-view.component';
import {BouncingBallsLoaderSyncComponent} from './bouncing-balls-loader-sync/bouncing-balls-loader-sync.component';
import {AdminPanelViewComponent} from './admin-panel-view/admin-panel-view.component';
import {AuthGuardAdmin} from './shared/guard/auth-guard-admin';
import {AuthService} from './shared/auth.service';
import {AuthGuardLeagueModerator} from './shared/guard/auth-guard-league-moderator';
import {AuthGuardLeaguePlayer} from './shared/guard/auth-guard-league-player';
import {AuthGuardSeasonModerator} from './shared/guard/auth-guard-season-moderator';
import {AuthGuardRoundPlayer} from './shared/guard/auth-guard-round-player';
import {AuthGuardRoundModerator} from './shared/guard/auth-guard-round-moderator';
import {ServiceWorkerModule} from '@angular/service-worker';
import {NewSeasonViewComponent} from './new-season-view/new-season-view.component';
import {AddBonusPointsViewComponent} from './add-bonus-points-view/add-bonus-points-view.component';
import {ErrorNotFoundViewComponent} from './error-not-found-view/error-not-found-view.component';
import {RouteEventsService} from './shared/route-events.service';
import {MyMatchesStatsComponent} from './dashboard-view/my-matches-stats/my-matches-stats.component';
import {TokenDecodeService} from './shared/token-decode.service';
import {AuthGuardUser} from "./shared/guard/auth-guard-user";
import {BonusPointsTableComponent} from "./add-bonus-points-view/bonus-points-table/bonus-points-table.component";
import {AuthGuardSeasonPlayer} from "./shared/guard/auth-guard-season-player";
import {IndividualGroupStatsComponent} from './league-players/individual-group-stats/individual-group-stats.component';
import {RoundsStatsComponent} from './league-players/rounds-stats/rounds-stats.component';
import {RoundStatsScoreboardComponent} from "./league-players/rounds-stats-scoreboard/rounds-stats-scoreboard.component";
import {NotFoundMessageComponent} from './not-found-message/not-found-message.component';
import {DashboardViewComponent} from './dashboard-view/dashboard-view.component';
import {CssSpinnerComponent} from './css-spinner/css-spinner.component';
import {LeaguesSummaryComponent} from './dashboard-view/leagues-summary/leagues-summary.component';
import {ScoreBalanceComponent} from './dashboard-view/score-balance/score-balance.component';
import {TrophyIconComponent} from './dashboard-view/trophy-icon/trophy-icon.component';
import {CountUpModule} from 'ngx-countup';
import {PageHeaderComponent} from './page-header/page-header.component';
import {RemoveRoundDialogComponent} from "./round-view-edit/remove-round-dialog.component";
import {RoundMatchesPrintableViewComponent} from './round-matches-printable-view/round-matches-printable-view.component';
import {ApiEndpointsService} from "./shared/api-endpoints.service";
import {BalancePipe} from './shared/pipes/balance.pipe';
import {LogoSanitizedPipe} from './shared/pipes/logoSanitized.pipe';
import {HomeViewComponent} from './home-view/home-view.component';
import {MESSAGE_FORMAT_CONFIG, TranslateMessageFormatCompiler} from "ngx-translate-messageformat-compiler";
import { LeagueLogoComponent } from './league-logo/league-logo.component';
import { LeagueModeratorViewComponent } from './league-moderator-view/league-moderator-view.component';
import { LeaguesAdminViewComponent } from './admin-panel-view/leagues-admin-view/leagues-admin-view.component';
import { PlayersAdminViewComponent } from './admin-panel-view/players-admin-view/players-admin-view.component';
import { PlayersTableComponent } from './admin-panel-view/players-admin-view/players-table/players-table.component';
import { LeaguesTableComponent } from './admin-panel-view/leagues-admin-view/leagues-table/leagues-table.component';

const cookieConfig: NgcCookieConsentConfig = {
    cookie: {
        domain: environment.cookieDomain,
    },
    palette: {
        popup: {
            background: '#673ab7',
        },
        button: {
            background: '#673ab7',
        },
    },
    theme: 'edgeless',
    type: 'info'
};

@NgModule({
    declarations: [
        AppComponent,
        XpPointsViewComponent,
        SeasonViewComponent,
        RoundViewComponent,
        RoundGroupMatchesComponent,
        RoundGroupScoreboardComponent,
        AllLeaguesViewComponent,
        LeaguePlayersComponent,
        PlayersScoreboardComponent,
        PlayersMatchesComponent,
        NewRoundViewComponent,
        AboutAppViewComponent,
        LoginViewComponent,
        SignupViewComponent,
        ForgotPasswordViewComponent,
        LogoutViewComponent,
        ResetPasswordViewComponent,
        RoundGroupMatchesEditableComponent,
        RoundViewEditComponent,
        CookiePolicyViewComponent,
        LeagueStatsViewComponent,
        LeagueScoreboardComponent,
        HallOfFameComponent,
        OveralStatsComponent,
        PerSeasonStatsComponent,
        SeasonScoreboardTableComponent,
        SeasonBalancesTableComponent,
        ConfirmRegistrationViewComponent,
        BouncingBallsLoaderSyncComponent,
        AdminPanelViewComponent,
        NewSeasonViewComponent,
        AddBonusPointsViewComponent,
        ErrorNotFoundViewComponent,
        MyMatchesStatsComponent,
        BonusPointsTableComponent,
        IndividualGroupStatsComponent,
        RoundsStatsComponent,
        RoundStatsScoreboardComponent,
        NotFoundMessageComponent,
        DashboardViewComponent,
        CssSpinnerComponent,
        LeaguesSummaryComponent,
        ScoreBalanceComponent,
        TrophyIconComponent,
        PageHeaderComponent,
        RemoveRoundDialogComponent,
        RoundMatchesPrintableViewComponent,
        BalancePipe,
        LogoSanitizedPipe,
        HomeViewComponent,
        LeagueLogoComponent,
        LeagueModeratorViewComponent,
        LeaguesAdminViewComponent,
        PlayersAdminViewComponent,
        PlayersTableComponent,
        LeaguesTableComponent
    ],
    imports: [
        NgcCookieConsentModule.forRoot(cookieConfig),
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        BrowserAnimationsModule,
        MatSelectModule,
        MatSliderModule,
        MatRadioModule,
        MatTabsModule,
        MatTableModule,
        MatCheckboxModule,
        MatAutocompleteModule,
        MatInputModule,
        ReactiveFormsModule,
        MatToolbarModule,
        MatIconModule,
        MatListModule,
        MatButtonModule,
        MatDividerModule,
        MatChipsModule,
        MatCardModule,
        MatExpansionModule,
        MatSortModule,
        HttpClientModule,
        MatButtonToggleModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSidenavModule,
        MatSnackBarModule,
        MatMenuModule,
        GoogleChartsModule,
        MatSlideToggleModule,
        MatTooltipModule,
        BrowserAnimationsModule,
        CountUpModule,

        ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
        MatDialogModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: httpTranslateLoader,
                deps: [HttpClient]
            },
            compiler: {
                provide: TranslateCompiler,
                useClass: TranslateMessageFormatCompiler
            }
        })
    ],
    providers: [
        {
            provide: MAT_DATE_LOCALE,
            useValue: 'pl',
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        },
        {
            provide: MESSAGE_FORMAT_CONFIG,
            useValue: {locales: ['en', 'pl']},
        },
        RouteEventsService,
        TokenDecodeService,
        AuthGuardAdmin,
        AuthGuardUser,
        AuthGuardLeagueModerator,
        AuthGuardLeaguePlayer,
        AuthGuardSeasonModerator,
        AuthGuardSeasonPlayer,
        AuthGuardRoundModerator,
        AuthGuardRoundPlayer,
        AuthService,
        ApiEndpointsService,
    ],
    bootstrap: [AppComponent],
})

export class AppModule {
}

// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http);
}