import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-reset-password-view',
  templateUrl: './reset-password-view.component.html',
  styleUrls: ['./reset-password-view.component.css']
})
export class ResetPasswordViewComponent implements OnInit {

  messageSuccessfullSignup: string = "Great! Your password has been successfully reset. Feel free to sign in.";

  durationInSeconds = 7;

  hide: boolean;

  passwordField = new FormControl('', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z]).{5,}')]);

  token: string;
  username: string;
  email: string;

  getErrorMessageForPasswordField(): string {
    if (this.passwordField.hasError('required')) {
      return 'You must enter a value';
    } else if (this.passwordField.hasError('pattern')) {
      return 'min 5 chars, incl. upper/lower case';
    } else {
      return '';
    }
  }

  constructor(private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private http: HttpClient,
    private titleService: Title) {

    this.titleService.setTitle("Reset password");

    this.route.params.subscribe(params => this.token = params["token"]);
    console.log("Reseting password, token: " + this.token);

    // need to fetch user data from DB here
    this.username = "USERRRRR";
    this.email = "EMAILLLLLL@qqq";

    this.hide = true;
  }

  ngOnInit(): void {
    this.passwordField.markAsTouched();
  }

  resetPassword(): void {
    console.log("new password: " + this.passwordField.value);

    let newPassword: string = this.passwordField.value;

    this.passwordField.setValue("");

    if (this.isPasswordResetSuccessfull(newPassword)) {
      this.snackBar.open(this.messageSuccessfullSignup, "X", {
        duration: this.durationInSeconds * 1000,
        panelClass: ['mat-toolbar', 'mat-primary']
      });

      this.router.navigate([`/login`]);
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleDeleteKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.passwordField.valid) {
      this.resetPassword();
    }
  }

  isPasswordResetSuccessfull(newPassword: string): boolean {
    let params = new HttpParams()
      .set("token", this.token)
      .set("newPassword", newPassword);

    console.log(params);

    this.http.post<number>(environment.apiUrl + 'players/resetPassword', params).subscribe(
      () => {
        console.log("password reset done");
        return true;
      },
      (error) => {
        console.log("error -->", error)
        return false;
      }
    );
    return true;
  }


}
