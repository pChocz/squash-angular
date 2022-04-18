import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {XpPointsViewComponent} from './xp-points-view/xp-points-view.component';
import {SeasonViewComponent} from './season-view/season-view.component';
import {RoundViewComponent} from './round-view/round-view.component';
import {AllLeaguesViewComponent} from './all-leagues-view/all-leagues-view.component';
import {LeaguePlayersComponent} from './league-players/league-players.component';
import {NewRoundViewComponent} from './new-round-view/new-round-view.component';
import {AboutAppViewComponent} from './about-app-view/about-app-view.component';
import {LoginViewComponent} from './login-view/login-view.component';
import {SignupViewComponent} from './signup-view/signup-view.component';
import {ForgotPasswordViewComponent} from './forgot-password-view/forgot-password-view.component';
import {LogoutViewComponent} from './logout-view/logout-view.component';
import {ResetPasswordViewComponent} from './reset-password-view/reset-password-view.component';
import {ConfirmRegistrationViewComponent} from './confirm-registration-view/confirm-registration-view.component';
import {AdminPanelViewComponent} from './admin-panel-view/admin-panel-view.component';
import {AuthGuardAdmin} from './shared/guard/auth-guard-admin';
import {AuthGuardLeagueModerator} from './shared/guard/auth-guard-league-moderator';
import {AuthGuardLeaguePlayer} from './shared/guard/auth-guard-league-player';
import {AuthGuardRoundModerator} from './shared/guard/auth-guard-round-moderator';
import {NewSeasonViewComponent} from './new-season-view/new-season-view.component';
import {AddBonusPointsViewComponent} from './add-bonus-points-view/add-bonus-points-view.component';
import {AuthGuardSeasonModerator} from './shared/guard/auth-guard-season-moderator';
import {ErrorNotFoundViewComponent} from './error-not-found-view/error-not-found-view.component';
import {AuthGuardUser} from "./shared/guard/auth-guard-user";
import {AuthGuardSeasonPlayer} from "./shared/guard/auth-guard-season-player";
import {DashboardViewComponent} from "./dashboard-view/dashboard-view.component";
import {HomeViewComponent} from "./home-view/home-view.component";
import {LeagueModeratorViewComponent} from "./league-moderator-view/league-moderator-view.component";
import {MyAccountViewComponent} from "./my-account-view/my-account-view.component";
import {LeagueViewComponent} from "./league-view/league-view.component";
import {LeagueAdditionalMatchesComponent} from "./league-additional-matches/league-additional-matches.component";
import {HeadToHeadViewComponent} from "./head-to-head-view/head-to-head-view.component";
import {NewLeagueViewComponent} from "./new-league-view/new-league-view.component";
import {PrivacyPolicyViewComponent} from "./privacy-policy-view/privacy-policy-view.component";
import {GdprPolicyViewComponent} from "./gdpr-policy-view/gdpr-policy-view.component";
import {TermsOfUseViewComponent} from "./terms-of-use-view/terms-of-use-view.component";
import {ContactFormViewComponent} from "./contact-form-view/contact-form-view.component";
import {CourtCalculatorViewComponent} from "./court-calculator-view/court-calculator-view.component";
import {RecreateRoundViewComponent} from "./recreate-round-view/recreate-round-view.component";
import {AdminPlayerEditComponent} from "./admin-player-edit/admin-player-edit.component";
import {LogInUsingMagicLinkViewComponent} from "./log-in-using-magic-link-view/log-in-using-magic-link-view.component";
import {RequestMagicLinkViewComponent} from "./request-magic-link-view/request-magic-link-view.component";
import {CourtCalculatorDetailedViewComponent} from "./court-calculator-detailed-view/court-calculator-detailed-view.component";
import {LeaguePlayerRoundsStatsComponent} from "./league-player-rounds-stats/league-player-rounds-stats.component";
import {ConfirmEmailChangeViewComponent} from "./confirm-email-change-view/confirm-email-change-view.component";
import {LogsViewComponent} from "./logs-view/logs-view.component";
import {
  LeaguePlayersSeasonsStatsComponent
} from "./league-players-seasons-stats/league-players-seasons-stats.component";
import {AddLostBallsViewComponent} from "./add-lost-balls-view/add-lost-balls-view.component";

const routes: Routes = [
  {
    path: '',
    component: HomeViewComponent,
  },
  {
    path: 'admin-panel/:tab',
    component: AdminPanelViewComponent,
    canActivate: [AuthGuardAdmin]
  },
  {
    path: 'admin-panel',
    redirectTo: "admin-panel/players",
    pathMatch: 'full'
  },
  {
    path: 'app-logs',
    component: LogsViewComponent,
    canActivate: [AuthGuardAdmin]
  },
  {
    path: 'admin-player-edit/:uuid',
    component: AdminPlayerEditComponent,
    canActivate: [AuthGuardAdmin]
  },
  {
    path: 'login',
    component: LoginViewComponent
  },
  {
    path: 'logout',
    component: LogoutViewComponent
  },
  {
    path: 'register',
    component: SignupViewComponent
  },
  {
    path: 'my-account',
    component: MyAccountViewComponent,
    canActivate: [AuthGuardUser],
  },
  {
    path: 'confirm-registration/:token',
    component: ConfirmRegistrationViewComponent
  },
  {
    path: 'confirm-email-change/:token',
    component: ConfirmEmailChangeViewComponent
  },

  {
    path: 'request-magic-link',
    component: RequestMagicLinkViewComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordViewComponent
  },
  {
    path: 'login-with-magic-link/:token',
    component: LogInUsingMagicLinkViewComponent
  },
  {
    path: 'reset-password/:token',
    component: ResetPasswordViewComponent
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyViewComponent
  },
  {
    path: 'gdpr-policy',
    component: GdprPolicyViewComponent
  },
  {
    path: 'terms-of-use',
    component: TermsOfUseViewComponent
  },
  {
    path: 'contact-form',
    component: ContactFormViewComponent
  },
  {
    path: 'court-calculator',
    component: CourtCalculatorViewComponent
  },
  {
    path: 'court-calculator-detailed',
    component: CourtCalculatorDetailedViewComponent
  },
  {
    path: 'leagues',
    component: AllLeaguesViewComponent,
    canActivate: [AuthGuardUser],
  },
  {
    path: 'league-moderating/:uuid/:tab',
    component: LeagueModeratorViewComponent,
    canActivate: [AuthGuardLeagueModerator],
  },
  {
    path: 'league-moderating/:uuid',
    redirectTo: "league-moderating/:uuid/players",
    pathMatch: 'full'
  },
  {
    path: 'leagues/:uuid',
    component: AllLeaguesViewComponent
  },
  {
    path: 'league/:uuid',
    redirectTo: "league/:uuid/overal",
    pathMatch: 'full'
  },
  {
    path: 'league/:uuid/:tab',
    component: LeagueViewComponent,
    canActivate: [AuthGuardLeaguePlayer]
  },
  {
    path: 'league-additional-matches/:uuid',
    component: LeagueAdditionalMatchesComponent,
    canActivate: [AuthGuardLeaguePlayer],
  },
  {
    path: 'head-to-head/:firstPlayerUuid/:secondPlayerUuid',
    component: HeadToHeadViewComponent,
    canActivate: [AuthGuardUser],
  },
  {
    path: 'about-app',
    component: AboutAppViewComponent
  },
  {
    path: 'xp-points',
    component: XpPointsViewComponent,
    canActivate: [AuthGuardUser],
  },
  {
    path: 'season/:uuid',
    component: SeasonViewComponent
  },
  {
    path: 'round/:uuid/:tab',
    component: RoundViewComponent
  },
  {
    path: 'round/:uuid',
    redirectTo: "round/:uuid/0",
    pathMatch: 'full'
  },
  {
    path: 'league-players/:uuid',
    component: LeaguePlayersComponent,
    canActivate: [AuthGuardLeaguePlayer],
  },
  {
    path: 'league-rounds/:uuid',
    component: LeaguePlayerRoundsStatsComponent,
    canActivate: [AuthGuardLeaguePlayer],
  },
  {
    path: 'league-seasons/:uuid',
    component: LeaguePlayersSeasonsStatsComponent,
    canActivate: [AuthGuardLeaguePlayer],
  },
  {
    path: 'new-round',
    component: NewRoundViewComponent,
    canActivate: [AuthGuardSeasonModerator],
  },
  {
    path: 'recreate-round/:seasonUuid/:roundUuid',
    component: RecreateRoundViewComponent,
    canActivate: [AuthGuardRoundModerator],
  },
  {
    path: 'new-season',
    component: NewSeasonViewComponent,
    canActivate: [AuthGuardLeagueModerator],
  },
  {
    path: 'new-league',
    component: NewLeagueViewComponent,
    canActivate: [AuthGuardUser],
  },
  {
    path: 'add-bonus-points',
    component: AddBonusPointsViewComponent,
    canActivate: [AuthGuardSeasonPlayer],
  },
  {
    path: 'add-lost-balls',
    component: AddLostBallsViewComponent,
    canActivate: [AuthGuardSeasonPlayer],
  },
  {
    path: 'not-found',
    component: ErrorNotFoundViewComponent
  },
  {
    path: 'dashboard',
    component: DashboardViewComponent,
    canActivate: [AuthGuardUser],
  },
  {
    path: '**',
    component: ErrorNotFoundViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {relativeLinkResolution: 'legacy'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
