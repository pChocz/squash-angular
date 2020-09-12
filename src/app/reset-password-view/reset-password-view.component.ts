import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { PlayerDetailed } from '../shared/player-detailed.model';
import { plainToClass } from 'class-transformer';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-reset-password-view',
  templateUrl: './reset-password-view.component.html',
  styleUrls: ['./reset-password-view.component.css']
})
export class ResetPasswordViewComponent implements OnInit {

  durationInSeconds = 7;
  messageSuccessPasswordReset: string = "Great! Your password has been successfully reset. Feel free to sign in.";
  messageErrorPasswordReset: string = "Error! Sorry, your password could not be changed for some reason.";
  passwordField = new FormControl('', [Validators.required, Validators.minLength(5)]);
  hide: boolean;
  token: string;
  username: string;
  email: string;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private http: HttpClient,
    private titleService: Title) {

  }

  ngOnInit(): void {
    this.hide = true;
    this.passwordField.markAsTouched();
    this.titleService.setTitle("Reset password");
    this.route.params.subscribe(params => this.token = params["token"]);
    this.http.get<PlayerDetailed>(environment.apiUrl + 'token/passwordReset/' + this.token)
      .pipe(
        map(result => plainToClass(PlayerDetailed, result)))
      .subscribe(result => {
        let player: PlayerDetailed = result;
        this.username = player.username;
        this.email = player.email;
      });
  }

  resetPassword(): void {
    let newPassword: string = this.passwordField.value;
    this.passwordField.setValue("");

    let params = new HttpParams()
      .set("token", this.token)
      .set("newPassword", newPassword);

    this.http.post<number>(environment.apiUrl + 'players/resetPassword', params)
      .subscribe(
        () => {
          this.snackBar.open(this.messageSuccessPasswordReset, "X", {
            duration: this.durationInSeconds * 1000,
            panelClass: ['mat-toolbar', 'mat-primary']
          });
          this.router.navigate([`/login`]);
        },
        (error) => {
          this.snackBar.open(this.messageErrorPasswordReset, "X", {
            duration: this.durationInSeconds * 1000,
            panelClass: ['mat-toolbar', 'mat-warn']
          });
        }
      );
  }

  @HostListener('document:keydown', ['$event'])
  handleDeleteKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.passwordField.valid) {
      this.resetPassword();
    }
  }

  getErrorMessageForPasswordField(): string {
    if (this.passwordField.hasError('required')) {
      return 'You must enter a value';
    } else if (this.passwordField.hasError('pattern')) {
      return 'min 5 chars, incl. upper/lower case';
    } else {
      return '';
    }
  }

}
