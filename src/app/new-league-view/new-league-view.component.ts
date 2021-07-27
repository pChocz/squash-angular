import {Component, OnInit} from '@angular/core';
import {AbstractControl, AsyncValidatorFn, FormControl, ValidationErrors, Validators} from "@angular/forms";
import {HttpBackend, HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";
import {catchError, map} from "rxjs/operators";
import {Observable, of} from "rxjs";
import {encode} from 'url-safe-base64'
import {MyErrorStateMatcher} from "../shared/error-state-matcher";

@Component({
  selector: 'app-new-league-view',
  templateUrl: './new-league-view.component.html',
  styleUrls: ['./new-league-view.component.css']
})
export class NewLeagueViewComponent implements OnInit {

  matcher = new MyErrorStateMatcher();

  leagueNameField = new FormControl('', [
    Validators.required,
    Validators.minLength(5),
    Validators.maxLength(30),
  ], [
    this.leagueNameTakenValidator()
  ]);

  matchFormatTypes: string[] = [
    'ONE_GAME',
    'BEST_OF_3',
    'BEST_OF_5'
  ];

  setWinningTypes: string[] = [
    'ADV_OF_2_ABSOLUTE',
    'WINNING_POINTS_ABSOLUTE',
    'ADV_OF_2_OR_1_AT_THE_END'
  ];

  setFinishOption: string;

  matchFormatType: string;

  numberOfRounds: number;
  numberOfRoundsToBeDeducted: number;

  regularSetWinningType: string;
  regularSetWinningPoints: number;

  tiebreakWinningType: string;
  tiebreakWinningPoints: number;

  leagueWhere: string;
  leagueWhen: string;

  logoBase64: any;


  constructor(private http: HttpClient,
              private apiEndpointsService: ApiEndpointsService,
              private handler: HttpBackend,
              private router: Router,
              private snackBar: MatSnackBar,
              private titleService: Title,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.translateService
    .get('league.new.title')
    .subscribe((translation: string) => {
      this.titleService.setTitle(translation);
    });

    // default values
    this.matchFormatType = 'BEST_OF_3';
    this.numberOfRounds = 10;
    this.numberOfRoundsToBeDeducted = 2;
    this.regularSetWinningType = 'ADV_OF_2_OR_1_AT_THE_END';
    this.regularSetWinningPoints = 11;
    this.tiebreakWinningType = 'WINNING_POINTS_ABSOLUTE';
    this.tiebreakWinningPoints = 9;

    this.setFinishOption = 'TIE_BREAK';

    this.http.get('assets/img/logo_192.png', {responseType: 'blob'}).subscribe(blob => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onload = (event: any) => {
            this.logoBase64 = event.target.result.replace(/^data:image\/(png|jpg);base64,/, "");
          };
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            // A client-side or network error occurred. Handle it accordingly.
            console.log('An error occurred:', err.error.message);
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
          }
        }
    );
  }

  submitCreateNewLeague() {
    if (this.matchFormatType === 'ONE_GAME') {
      this.setFinishOption = 'NO_TIE_BREAK';
    }
    if (this.setFinishOption === 'NO_TIE_BREAK') {
      this.tiebreakWinningType = this.regularSetWinningType;
      this.tiebreakWinningPoints = this.regularSetWinningPoints;
    }

    // mandatory params
    let params = new HttpParams()
    .set('leagueName', this.leagueNameField.value)
    .set('logoBase64', encode(this.logoBase64)) // encodes to URL safe base64 string
    .set('numberOfRounds', this.numberOfRounds)
    .set('numberOfRoundsToBeDeducted', this.numberOfRoundsToBeDeducted)
    .set('matchFormatType', this.matchFormatType)
    .set('regularSetWinningType', this.regularSetWinningType)
    .set('regularSetWinningPoints', this.regularSetWinningPoints)
    .set('tiebreakWinningType', this.tiebreakWinningType)
    .set('tiebreakWinningPoints', this.tiebreakWinningPoints);

    // optional params
    if (this.leagueWhen) {
      params = params.append('leagueWhen', this.leagueWhen);
    }
    if (this.leagueWhere) {
      params = params.append('leagueWhere', this.leagueWhere);
    }

    console.log(params);

    this.http
    .post<string>(this.apiEndpointsService.getLeague(), params)
    .subscribe(
        uuid => {
          this.router.navigate(['league-moderating', uuid]);

        }, error => {
          this.snackBar.open("ERROR", 'X', {
            duration: 7 * 1000,
            panelClass: ['mat-toolbar', 'mat-warn'],
          });

        });
  }

  leagueNameTakenValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.http
      .get<Boolean>(this.apiEndpointsService.getCheckLeagueNameTaken(control.value))
      .pipe(
          map(result => result ? {leagueNameTaken: {value: control.value}} : null),
          catchError(() => of(null))
      )
    };
  }

  onFileSelected(event) {
    const files = event.target.files;
    const file = files[0];
    if (files && file) {
      const reader = new FileReader();
      reader.onload = this.handleFile.bind(this);
      reader.readAsBinaryString(file);
    }
  }

  handleFile(event) {
    const binaryString = event.target.result;
    this.logoBase64 = btoa(binaryString);
  }

  computeExampleSetResults(type: string, points: number): string {
    if (type === 'ADV_OF_2_ABSOLUTE') {
      return (points) + ':0' + ', '
          + (points) + ':' + (points - 2) + ', '
          + (points + 1) + ':' + (points - 1) + ', '
          + (points + 3) + ":" + (points + 1);

    } else if (type === 'WINNING_POINTS_ABSOLUTE') {
      return (points) + ':0' + ', '
          + (points) + ':' + (points - 4) + ', '
          + (points) + ':' + (points - 2) + ', '
          + (points) + ":" + (points - 1);

    } else if (type === 'ADV_OF_2_OR_1_AT_THE_END') {
      return (points) + ':0' + ', '
          + (points) + ':' + (points - 2) + ', '
          + (points + 1) + ':' + (points - 1) + ', '
          + (points + 1) + ":" + (points);

    } else {
      return '';
    }
  }

}
