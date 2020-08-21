import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { XpPointsViewComponent } from './xp-points-view/xp-points-view.component';
import { SeasonViewComponent } from './season-view/season-view.component';
import { RoundViewComponent } from './round-view/round-view.component';
import { AllLeaguesViewComponent } from './all-leagues-view/all-leagues-view.component';
import { LeaguePlayersComponent } from './league-players/league-players.component';
import { NewRoundViewComponent } from './new-round-view/new-round-view.component';
import { AboutAppViewComponent } from './about-app-view/about-app-view.component';
import { LoginViewComponent } from './login-view/login-view.component';
import { SignupViewComponent } from './signup-view/signup-view.component';
import { ForgotPasswordViewComponent } from './forgot-password-view/forgot-password-view.component';
import { LogoutViewComponent } from './logout-view/logout-view.component';
import { ResetPasswordViewComponent } from './reset-password-view/reset-password-view.component';
import { RoundViewEditComponent } from './round-view-edit/round-view-edit.component';


const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "leagues" },
  { path: "login", component: LoginViewComponent },
  { path: "logout", component: LogoutViewComponent },
  { path: "register", component: SignupViewComponent },
  { path: "forgot-password", component: ForgotPasswordViewComponent },
  { path: "reset-password/:token", component: ResetPasswordViewComponent },
  { path: "leagues", component: AllLeaguesViewComponent },
  { path: "about-app", component: AboutAppViewComponent },
  { path: "xp-points", component: XpPointsViewComponent },
  { path: "season/:uid", component: SeasonViewComponent },
  { path: "round/:uid", component: RoundViewComponent },
  { path: "round-edit/:uid", component: RoundViewEditComponent },
  { path: "league-players/:uid", component: LeaguePlayersComponent },
  { path: "new-round/:seasonId/:roundNumber", component: NewRoundViewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
