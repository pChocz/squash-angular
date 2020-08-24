import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-signup-view',
  templateUrl: './signup-view.component.html',
  styleUrls: ['./signup-view.component.css']
})
export class SignupViewComponent implements OnInit {

  messageCredentialsTaken: string = "Username and/or email is already taken.";
  // messageSuccessfullSignup: string = "Great! We have registered an account for provided credentials and sent an activation message to you.";
  messageSuccessfullSignup: string = "Nice to know that you have tried, but it's not working yet. Please sign in using existing credentials";

  durationInSeconds = 7;

  hide: boolean;

  emailField = new FormControl('', [Validators.required, Validators.email]);
  usernameField = new FormControl('', [Validators.required, Validators.maxLength(20), Validators.minLength(5)]);
  passwordField = new FormControl('', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z]).{5,}')]);

  isValidInput(): boolean {
    return (this.emailField.valid && this.usernameField.valid && this.passwordField.valid);
  }

  getErrorMessageForEmailField(): string {
    if (this.emailField.hasError('required')) {
      return 'You must enter a value';
    } else if (this.emailField.hasError('email')) {
      return 'Not a valid email';
    } else {
      return '';
    }
  }

  getErrorMessageForUsernameField(): string {
    if (this.usernameField.hasError('required')) {
      return 'You must enter a value';
    } else if (this.usernameField.hasError('minlength') || this.usernameField.hasError('maxlength')) {
      return '5-20 chars';
    } else {
      return '';
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

  constructor(private router: Router,
    private snackBar: MatSnackBar,
    private titleService: Title) {

    this.titleService.setTitle("Sign up");
    this.hide = true;
  }

  ngOnInit(): void {
  }

  signup(): void {
    console.log("user: " + this.usernameField.value);
    console.log("password: " + this.passwordField.value);

    let username: string = this.usernameField.value;
    let email: string = this.emailField.value;
    let password: string = this.passwordField.value;

    this.usernameField.setValue("");
    this.emailField.setValue("");
    this.passwordField.setValue("");

    if (this.isRegistrationSuccessfull(username, email, password)) {
      this.snackBar.open(this.messageSuccessfullSignup, "X", {
        duration: this.durationInSeconds * 1000,
        panelClass: ['mat-toolbar', 'mat-primary']
      });

      this.router.navigate([`/login`]);

    } else {
      this.snackBar.open(this.messageCredentialsTaken, "X", {
        duration: this.durationInSeconds * 1000,
        panelClass: ['mat-toolbar', 'mat-warn']
      });
    }

  }

  @HostListener('document:keydown', ['$event'])
  handleDeleteKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.isValidInput()) {
      this.signup();
    }
  }

  isRegistrationSuccessfull(username: string, email: string, password: string): boolean {
    if (username !== "user" && email !== "user@wp.pl") {
      return true;
    } else {
      return false;
    }
  }


}
