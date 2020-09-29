// angular core
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// angular material
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

// google charts
import { GoogleChartsModule } from 'angular-google-charts';

// app components
import { XpPointsViewComponent } from './xp-points-view/xp-points-view.component';
import { SeasonViewComponent } from './season-view/season-view.component';
import { RoundViewComponent } from './round-view/round-view.component';
import { RoundGroupMatchesComponent } from './round-view/round-group-matches/round-group-matches.component';
import { RoundGroupScoreboardComponent } from './round-view/round-group-scoreboard/round-group-scoreboard.component';
import { AllLeaguesViewComponent } from './all-leagues-view/all-leagues-view.component';
import { LeaguePlayersComponent } from './league-players/league-players.component';
import { PlayersScoreboardComponent } from './league-players/players-scoreboard/players-scoreboard.component';
import { PlayersMatchesComponent } from './league-players/players-matches/players-matches.component';
import { NewRoundViewComponent } from './new-round-view/new-round-view.component';
import { AboutAppViewComponent } from './about-app-view/about-app-view.component';
import { AboutDeveloperViewComponent } from './about-developer-view/about-developer-view.component';
import { LoginViewComponent } from './login-view/login-view.component';
import { SignupViewComponent } from './signup-view/signup-view.component';
import { ForgotPasswordViewComponent } from './forgot-password-view/forgot-password-view.component';
import { LogoutViewComponent } from './logout-view/logout-view.component';
import { ResetPasswordViewComponent } from './reset-password-view/reset-password-view.component';
import { RoundGroupMatchesEditableComponent } from './round-view-edit/round-group-matches-editable/round-group-matches-editable.component';
import { RoundViewEditComponent } from './round-view-edit/round-view-edit.component';
import { AuthInterceptor } from './shared/auth-interceptor';
import { HomeViewComponent } from './home-view/home-view.component';
import { NgcCookieConsentModule, NgcCookieConsentConfig } from 'ngx-cookieconsent';
import { environment } from 'src/environments/environment';
import { CookiePolicyViewComponent } from './cookie-policy-view/cookie-policy-view.component';
import { LeagueStatsViewComponent } from './league-stats-view/league-stats-view.component';
import { LeagueScoreboardComponent } from './league-stats-view/league-scoreboard/league-scoreboard.component';
import { HallOfFameComponent } from './league-stats-view/hall-of-fame/hall-of-fame.component';
import { OveralStatsComponent } from './league-stats-view/overal-stats/overal-stats.component';
import { PerSeasonStatsComponent } from './league-stats-view/per-season-stats/per-season-stats.component';
import { SeasonScoreboardTableComponent } from './season-view/season-scoreboard-table/season-scoreboard-table.component';
import { SeasonBalancesTableComponent } from './season-view/season-balances-table/season-balances-table.component';
import { ConfirmRegistrationViewComponent } from './confirm-registration-view/confirm-registration-view.component';
import { BouncingBallsLoaderSyncComponent } from './bouncing-balls-loader-sync/bouncing-balls-loader-sync.component';
import { BouncingBallsLoaderAsyncComponent } from './bouncing-balls-loader-async/bouncing-balls-loader-async.component';
import { AdminPanelViewComponent } from './admin-panel-view/admin-panel-view.component';
import { AuthGuardAdmin } from './shared/auth-guard-admin';
import { AuthService } from './shared/auth.service';
import { AuthGuardLeagueModerator } from './shared/auth-guard-league-moderator';
import { AuthGuardLeaguePlayer } from './shared/auth-guard-league-player';
import { AuthGuardSeasonModerator } from './shared/auth-guard-season-moderator';
import { AuthGuardRoundPlayer } from './shared/auth-guard-round-player';
import { AuthGuardRoundModerator } from './shared/auth-guard-round-moderator';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NewSeasonViewComponent } from './new-season-view/new-season-view.component';
import { AddBonusPointsViewComponent } from './add-bonus-points-view/add-bonus-points-view.component';

const cookieConfig: NgcCookieConsentConfig = {
  cookie: {
    domain: environment.cookieDomain
  },
  palette: {
    popup: {
      background: '#673ab7'
    },
    button: {
      background: '#673ab7',
    }
  },
  theme: 'edgeless',
  type: 'info',
  elements: {
    messagelink: `
    <span id="cookieconsent:desc" class="cc-message">{{message}} 
      <a aria-label="learn more about cookies" tabindex="0" class="cc-link" href="{{cookiePolicyHref}}" target="_blank">{{cookiePolicyLink}}</a>
    </span>
    `,
  },
  content: {
    message: 'By using our app, you acknowledge that you have read and understand our ',
    cookiePolicyLink: 'Cookie Policy',
    cookiePolicyHref: '/cookie-policy',
  }
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
    AboutDeveloperViewComponent,
    LoginViewComponent,
    SignupViewComponent,
    ForgotPasswordViewComponent,
    LogoutViewComponent,
    ResetPasswordViewComponent,
    RoundGroupMatchesEditableComponent,
    RoundViewEditComponent,
    HomeViewComponent,
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
    BouncingBallsLoaderAsyncComponent,
    AdminPanelViewComponent,
    NewSeasonViewComponent,
    AddBonusPointsViewComponent,
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

    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'pl'
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    AuthGuardAdmin,
    AuthGuardLeagueModerator,
    AuthGuardLeaguePlayer,
    AuthGuardSeasonModerator,
    AuthGuardRoundModerator,
    AuthGuardRoundPlayer,
    AuthService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
