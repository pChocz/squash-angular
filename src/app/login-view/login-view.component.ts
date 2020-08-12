import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { debuglog } from 'util';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login-view',
  templateUrl: './login-view.component.html',
  styleUrls: ['./login-view.component.css']
})
export class LoginViewComponent implements OnInit {

  durationInSeconds = 7;
  messageIncorrectCredentials: string = "Incorrect username/email or password.";
  messageCorrectLogin: string = "You have been succesfully signed in.";

  hide: boolean;

  username: string = "";
  password: string = "";

  constructor(private router: Router,
    private snackBar: MatSnackBar,
    private titleService: Title) {

    this.titleService.setTitle("Sign in");
    this.hide = true;
  }

  ngOnInit(): void {
  }

  isEmptyInput(): boolean {
    return (this.username.length === 0 || this.password.length === 0)
  }


  login(): void {
    console.log("user: " + this.username);
    console.log("password: " + this.password);

    if (this.areCredentialsValid()) {
      this.snackBar.open(this.messageCorrectLogin, "X", {
        duration: this.durationInSeconds * 1000,
        panelClass: ['mat-toolbar', 'mat-primary']
      });

      this.router.navigate([`/leagues/0`]);

    } else {
      this.snackBar.open(this.messageIncorrectCredentials, "X", {
        duration: this.durationInSeconds * 1000,
        panelClass: ['mat-toolbar', 'mat-warn']
      });
      this.password = "";
    }
  }


  @HostListener('document:keydown', ['$event'])
  handleDeleteKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter' && !this.isEmptyInput()) {
      this.login();
    }
  }

  areCredentialsValid(): boolean {
    if (this.username === "user" && this.password === "user") {
      return true;
    } else {
      return false;
    }
  }


}
