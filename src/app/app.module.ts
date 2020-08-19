// angular core
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

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
import { LoginViewComponent } from './login-view/login-view.component';
import { SignupViewComponent } from './signup-view/signup-view.component';
import { ForgotPasswordViewComponent } from './forgot-password-view/forgot-password-view.component';
import { LogoutViewComponent } from './logout-view/logout-view.component';
import { ResetPasswordViewComponent } from './reset-password-view/reset-password-view.component';
import { CircleSpinnerComponent } from './circle-spinner/circle-spinner.component';
import { RoundGroupMatchesEditableComponent } from './round-view-edit/round-group-matches-editable/round-group-matches-editable.component';
import { RoundViewEditComponent } from './round-view-edit/round-view-edit.component';

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
    CircleSpinnerComponent,
    RoundGroupMatchesEditableComponent,
    RoundViewEditComponent
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
    MatSnackBarModule,
    MatMenuModule,
    GoogleChartsModule,

  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pl' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
