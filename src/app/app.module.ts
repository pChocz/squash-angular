// Explanation for version syntax:

// caret syntax - Compatible with version
// ex:
// - ~1.2.3 is equivalent to '>=1.2.3 <1.3.0'
// - ~0.1.2 is equivalent to '>=0.1.2 <0.2.0'

// tilde syntax - Approximately equivalent to version
// ex:
// - ^1.2.3 is equivalent to '>=1.2.3 <2.0.0'
// - ^0.1.2 is equivalent to '>=0.1.2 <0.2.0'

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
import '@angular/common/locales/global/pl';

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
import {RoundGroupMatchesEditableComponent} from './round-view/round-group-matches-editable/round-group-matches-editable.component';
import {AuthInterceptor} from './shared/auth-interceptor';
import {NgcCookieConsentConfig, NgcCookieConsentModule} from 'ngx-cookieconsent';
import {environment} from 'src/environments/environment';
import {LeagueScoreboardComponent} from './league-view/league-scoreboard/league-scoreboard.component';
import {HallOfFameComponent} from './league-view/hall-of-fame/hall-of-fame.component';
import {OveralStatsComponent} from './league-view/overal-stats/overal-stats.component';
import {PerSeasonStatsComponent} from './league-view/per-season-stats/per-season-stats.component';
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
import {RoundStatsScoreboardComponent} from "./league-player-rounds-stats/rounds-stats-scoreboard/rounds-stats-scoreboard.component";
import {NotFoundMessageComponent} from './not-found-message/not-found-message.component';
import {DashboardViewComponent} from './dashboard-view/dashboard-view.component';
import {CssSpinnerComponent} from './css-spinner/css-spinner.component';
import {LeaguesSummaryComponent} from './dashboard-view/leagues-summary/leagues-summary.component';
import {ScoreBalanceComponent} from './dashboard-view/score-balance/score-balance.component';
import {TrophyIconComponent} from './dashboard-view/trophy-icon/trophy-icon.component';
import {CountUpModule} from 'ngx-countup';
import {PageHeaderComponent} from './page-header/page-header.component';
import {RoundMatchesPrintableViewComponent} from './round-matches-printable-view/round-matches-printable-view.component';
import {ApiEndpointsService} from "./shared/api-endpoints.service";
import {BalancePipe} from './shared/pipes/balance.pipe';
import {DecimalGroupingPipe} from './shared/pipes/decimalGrouping.pipe';
import {LogoSanitizedPipe} from './shared/pipes/logoSanitized.pipe';
import {HomeViewComponent} from './home-view/home-view.component';
import {
  MESSAGE_FORMAT_CONFIG,
  TranslateMessageFormatCompiler
} from "ngx-translate-messageformat-compiler";
import {LeagueLogoComponent} from './league-logo/league-logo.component';
import {LeagueModeratorViewComponent} from './league-moderator-view/league-moderator-view.component';
import {LeaguesAdminViewComponent} from './admin-panel-view/leagues-admin-view/leagues-admin-view.component';
import {LeaguesTableComponent} from './admin-panel-view/leagues-admin-view/leagues-table/leagues-table.component';
import {Globals} from "./globals";
import {MyAccountViewComponent} from './my-account-view/my-account-view.component';
import {ChangePasswordDialogComponent} from "./my-account-view/change-password-dialog.component";
import {LeagueViewComponent} from './league-view/league-view.component';
import {LeagueBoardComponent} from './league-view/league-board/league-board.component';
import {CountUpTileComponent} from './league-view/count-up-tile/count-up-tile.component';
import {TextTileComponent} from './league-view/text-tile/text-tile.component';
import {RulesComponent} from './league-view/rules/rules.component';
import {MostRecentRoundComponent} from './league-view/most-recent-round/most-recent-round.component';
import {CurrentSeasonComponent} from './league-view/current-season/current-season.component';
import {LeagueAdditionalMatchesComponent} from './league-additional-matches/league-additional-matches.component';
import {NewAdditionalMatchDialogComponent} from "./league-additional-matches/new-additional-match-dialog.component";
import {EditAdditionalMatchDialogComponent} from "./league-additional-matches/edit-additional-match-dialog.component";
import {ConfirmationDialogComponent} from './confirmation-dialog/confirmation-dialog.component';
import {HeadToHeadViewComponent} from './head-to-head-view/head-to-head-view.component';
import {MatchesComponent} from './head-to-head-view/matches/matches.component';
import {CountUpTileTripleComponent} from './common-components/count-up-tile-triple/count-up-tile-triple.component';
import {HeadToHeadChartComponent} from './head-to-head-view/head-to-head-chart/head-to-head-chart.component';
import {CountUpTileSixComponent} from './common-components/count-up-tile-six/count-up-tile-six.component';
import {NewLeagueViewComponent} from './new-league-view/new-league-view.component';
import {RangePipe} from "./shared/pipes/range.pipe";
import {LocalizedDatePipe} from "./shared/pipes/localizedDate.pipe";
import {BlockUIModule} from "ng-block-ui";
import {AuthGuardValidTokens} from "./shared/guard/auth-guard-valid-tokens";
import {PrivacyPolicyViewComponent} from './privacy-policy-view/privacy-policy-view.component';
import {TermsOfUseViewComponent} from './terms-of-use-view/terms-of-use-view.component';
import {GdprPolicyViewComponent} from './gdpr-policy-view/gdpr-policy-view.component';
import {ContactFormViewComponent} from './contact-form-view/contact-form-view.component';
import {LeagueRolesViewComponent} from './admin-panel-view/league-roles-view/league-roles-view.component';
import {CourtCalculatorViewComponent} from './court-calculator-view/court-calculator-view.component';
import {RecreateRoundViewComponent} from "./recreate-round-view/recreate-round-view.component";
import {ChangeEmojiDialogComponent} from "./my-account-view/change-emoji-dialog.component";
import {RoundGroupNumberToLetterPipe} from "./shared/pipes/roundGroupNumberToLetter.pipe";
import {UsersAdminViewComponent} from './admin-panel-view/users-admin-view/users-admin-view.component';
import {UsersTableComponent} from './admin-panel-view/users-admin-view/users-table/users-table.component';
import {ClipboardModule} from "@angular/cdk/clipboard";
import {AdminPlayerEditComponent} from './admin-player-edit/admin-player-edit.component';
import {LoggerModule, NgxLoggerLevel} from "ngx-logger";
import {MyLoggerService} from "./shared/my-logger.service";
import {LogInUsingMagicLinkViewComponent} from './log-in-using-magic-link-view/log-in-using-magic-link-view.component';
import {RequestMagicLinkViewComponent} from './request-magic-link-view/request-magic-link-view.component';
import {LeaguePlayerRoundsStatsComponent} from './league-player-rounds-stats/league-player-rounds-stats.component';
import {CourtCalculatorDetailedViewComponent} from './court-calculator-detailed-view/court-calculator-detailed-view.component';
import {ConfirmEmailChangeViewComponent} from './confirm-email-change-view/confirm-email-change-view.component';
import {DirectivesModule} from "./shared/directives/directives.module";
import {EditHallOfFameDialogComponent} from "./league-view/hall-of-fame/edit-hall-of-fame-dialog.component";
import { TrophySelectorComponent } from './league-view/hall-of-fame/trophy-selector/trophy-selector.component';
import {
  TrophySelectorMultipleComponent
} from "./league-view/hall-of-fame/trophy-selector-multiple/trophy-selector-multiple.component";
import {LogsViewComponent} from './logs-view/logs-view.component';
import {LogsTableComponent} from './logs-view/logs-table/logs-table.component';
import {LogDateTimePipe} from "./shared/pipes/logDateTime.pipe";
import {NgxEchartsModule} from "ngx-echarts";
import {BeforeLoginOtherActionsComponent} from './before-login-other-actions/before-login-other-actions.component';
import {NgxMatDatetimePickerModule} from "@angular-material-components/datetime-picker";
import {NgxMatMomentModule} from "@angular-material-components/moment-adapter";
import {NgxSliderModule} from "@angular-slider/ngx-slider";
import {LeagueActionsButtonsComponent} from './league-actions-buttons/league-actions-buttons.component';
import {LeaguePlayersSeasonsStatsComponent} from './league-players-seasons-stats/league-players-seasons-stats.component';
import {SeasonsStatsScoreboardComponent} from './league-players-seasons-stats/seasons-stats-scoreboard/seasons-stats-scoreboard.component';
import {DatePipe} from "@angular/common";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import { RoleAssignerComponent } from './league-moderator-view/role-assigner/role-assigner.component';
import { PlayersModerateComponent } from './league-moderator-view/players-moderate/players-moderate.component';
import { SeasonsModerateComponent } from './league-moderator-view/seasons-moderate/seasons-moderate.component';
import { LeagueModerateComponent } from './league-moderator-view/league-moderate/league-moderate.component';

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
    RecreateRoundViewComponent,
    AboutAppViewComponent,
    LoginViewComponent,
    SignupViewComponent,
    ForgotPasswordViewComponent,
    LogoutViewComponent,
    ResetPasswordViewComponent,
    RoundGroupMatchesEditableComponent,
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
    RoundStatsScoreboardComponent,
    NotFoundMessageComponent,
    DashboardViewComponent,
    CssSpinnerComponent,
    LeaguesSummaryComponent,
    ScoreBalanceComponent,
    TrophyIconComponent,
    PageHeaderComponent,
    ChangePasswordDialogComponent,
    ChangeEmojiDialogComponent,
    RoundMatchesPrintableViewComponent,
    BalancePipe,
    DecimalGroupingPipe,
    RangePipe,
    RoundGroupNumberToLetterPipe,
    LocalizedDatePipe,
    LogDateTimePipe,
    LogoSanitizedPipe,
    HomeViewComponent,
    LeagueLogoComponent,
    LeagueModeratorViewComponent,
    LeaguesAdminViewComponent,
    LeaguesTableComponent,
    MyAccountViewComponent,
    LeagueViewComponent,
    LeagueBoardComponent,
    CountUpTileComponent,
    TextTileComponent,
    RulesComponent,
    MostRecentRoundComponent,
    CurrentSeasonComponent,
    LeagueAdditionalMatchesComponent,
    NewAdditionalMatchDialogComponent,
    EditAdditionalMatchDialogComponent,
    EditHallOfFameDialogComponent,
    ConfirmationDialogComponent,
    HeadToHeadViewComponent,
    MatchesComponent,
    CountUpTileTripleComponent,
    HeadToHeadChartComponent,
    CountUpTileSixComponent,
    NewLeagueViewComponent,
    PrivacyPolicyViewComponent,
    TermsOfUseViewComponent,
    GdprPolicyViewComponent,
    ContactFormViewComponent,
    LeagueRolesViewComponent,
    CourtCalculatorViewComponent,
    UsersAdminViewComponent,
    UsersTableComponent,
    AdminPlayerEditComponent,
    LogInUsingMagicLinkViewComponent,
    RequestMagicLinkViewComponent,
    LeaguePlayerRoundsStatsComponent,
    CourtCalculatorDetailedViewComponent,
    ConfirmEmailChangeViewComponent,
    TrophySelectorComponent,
    TrophySelectorMultipleComponent,
    LogsViewComponent,
    LogsTableComponent,
    BeforeLoginOtherActionsComponent,
    LeagueActionsButtonsComponent,
    LeaguePlayersSeasonsStatsComponent,
    SeasonsStatsScoreboardComponent,
    RoleAssignerComponent,
    PlayersModerateComponent,
    SeasonsModerateComponent,
    LeagueModerateComponent
  ],
  imports: [
    NgcCookieConsentModule.forRoot(cookieConfig),
    BlockUIModule.forRoot(),
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    NgxSliderModule,
    NgxMatDatetimePickerModule,
    NgxMatMomentModule,
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
    MatSlideToggleModule,
    MatTooltipModule,
    BrowserAnimationsModule,
    CountUpModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    MatDialogModule,
    HttpClientModule,
    LoggerModule.forRoot({
      level: NgxLoggerLevel.DEBUG,
      timestampFormat: 'HH:mm:ss.SSS',
    }),
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
    }),
    ClipboardModule,
    DirectivesModule,
    MatProgressBarModule
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
    DatePipe,
    RouteEventsService,
    TokenDecodeService,
    AuthGuardValidTokens,
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
    MyLoggerService,
    Globals
  ],
  bootstrap: [AppComponent],
})

export class AppModule {
}

// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}