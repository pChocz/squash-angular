import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { LeaguesViewComponent } from './leagues-view/leagues-view.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

// material components imports
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
import { XpPointsViewComponent } from './xp-points-view/xp-points-view.component';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { SeasonViewComponent } from './season-view/season-view.component';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { RoundViewComponent } from './round-view/round-view.component';
import { RoundGroupMatchesComponent } from './round-view/round-group-matches/round-group-matches.component';
import { RoundGroupScoreboardComponent } from './round-view/round-group-scoreboard/round-group-scoreboard.component';
import { AllLeaguesViewComponent } from './all-leagues-view/all-leagues-view.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LeaguePlayersComponent } from './league-players/league-players.component';
import { PlayersScoreboardComponent } from './league-players/players-scoreboard/players-scoreboard.component';
import { PlayersMatchesComponent } from './league-players/players-matches/players-matches.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import { NewRoundViewComponent } from './new-round-view/new-round-view.component';
import {MatDatepickerModule, MatDatepicker} from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import {MatSidenavModule} from '@angular/material/sidenav';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LeaguesViewComponent,
    XpPointsViewComponent,
    SeasonViewComponent,
    RoundViewComponent,
    RoundGroupMatchesComponent,
    RoundGroupScoreboardComponent,
    AllLeaguesViewComponent,
    LeaguePlayersComponent,
    PlayersScoreboardComponent,
    PlayersMatchesComponent,
    NewRoundViewComponent
  ],
  imports: [
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

  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'pl'},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
