import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LeaguesViewComponent } from './leagues-view/leagues-view.component';
import { PlayersMatchesViewComponent } from './players-matches-view/players-matches-view.component';
import { XpPointsViewComponent } from './xp-points-view/xp-points-view.component';
import { SeasonViewComponent } from './season-view/season-view.component';
import { RoundViewComponent } from './round-view/round-view.component';
import { AllLeaguesViewComponent } from './all-leagues-view/all-leagues-view.component';
import { LeaguePlayersComponent } from './league-players/league-players.component';


const routes: Routes = [
  {path:  "", pathMatch:  "full", redirectTo: "home"},
  {path: "home", component: AllLeaguesViewComponent},
  {path: "leagues-view", component: LeaguesViewComponent},
  {path: "players-matches-view", component: PlayersMatchesViewComponent},
  {path: "xp-points-view", component: XpPointsViewComponent},
  {path: "season-view/:uid", component: SeasonViewComponent},
  {path: "round-view/:uid", component: RoundViewComponent},
  {path: "league-players/:uid", component: LeaguePlayersComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
