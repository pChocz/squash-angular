import { Component, OnInit, HostListener } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-forgot-password-view',
  templateUrl: './forgot-password-view.component.html',
  styleUrls: ['./forgot-password-view.component.css']
})
export class ForgotPasswordViewComponent implements OnInit {

  durationInSeconds = 7;
  loadingMessage: string = "Processing";
  messagePasswordResetSent: string = "If an account for _EMAIL_PLACEHOLDER_ exists, password reset instructions will be sent via email.";
  emailField = new FormControl('', [Validators.required, Validators.email]);
  isLoading: boolean;

  getErrorMessageForEmailField() {
    if (this.emailField.hasError('required')) {
      return 'You must enter a value';
    } else if (this.emailField.hasError('email')) {
      return 'Not a valid email';
    } else {
      return '';
    }
  }

  constructor(
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private titleService: Title) {

  }

  ngOnInit(): void {
    this.titleService.setTitle("Forgot password");
    this.isLoading = false;
  }

  resetPassword(): void {
    this.isLoading = true;

    let emailToSend: string = this.emailField.value;
    this.emailField.setValue("");

    let params = new HttpParams()
      .set("usernameOrEmail", emailToSend)
      .set("frontendUrl", environment.frontendUrl);

    this.http.post<any>(environment.apiUrl + 'players/requestPasswordReset', params)
      .subscribe(
        () => {
          this.isLoading = false;
          console.log("Request went fine");
          this.snackBar.open(this.messagePasswordResetSent.replace("_EMAIL_PLACEHOLDER_", emailToSend), "X", {
            duration: this.durationInSeconds * 1000,
            panelClass: ['mat-toolbar', 'mat-primary']
          });
        },
        error => {
          this.isLoading = false;
          console.log("ERROR!", error);
        });
  }

  @HostListener('document:keydown', ['$event'])
  handleDeleteKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.emailField.valid) {
      this.resetPassword();
    }
  }

}
