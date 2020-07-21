import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LeaguesViewComponent } from './leagues-view/leagues-view.component';


const routes: Routes = [
  {path:  "", pathMatch:  "full", redirectTo: "home"},
  {path: "home", component: HomeComponent},
  {path: "leagues-view", component: LeaguesViewComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
