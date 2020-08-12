import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-forgot-password-view',
  templateUrl: './forgot-password-view.component.html',
  styleUrls: ['./forgot-password-view.component.css']
})
export class ForgotPasswordViewComponent implements OnInit {

  durationInSeconds = 7;

  messagePasswordResetSent: string = "If an account for _EMAIL_PLACEHOLDER_ exists, password reset instructions will be sent via email.";

  emailField = new FormControl('', [Validators.required, Validators.email]);

  getErrorMessageForEmailField() {
    if (this.emailField.hasError('required')) {
      return 'You must enter a value';
    } else if (this.emailField.hasError('email')) {
      return 'Not a valid email';
    } else {
      return '';
    }
  }

  constructor(private router: Router, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
  }

  resetPassword(): void {
    let emailToSend: string = this.emailField.value;
    this.emailField.setValue("");

    this.snackBar.open(this.messagePasswordResetSent.replace("_EMAIL_PLACEHOLDER_", emailToSend), "X", {
      duration: this.durationInSeconds * 1000,
      panelClass: ['mat-toolbar', 'mat-primary']
    });
  }

  @HostListener('document:keydown', ['$event'])
  handleDeleteKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.emailField.valid) {
      this.resetPassword();
    }
  }

}
