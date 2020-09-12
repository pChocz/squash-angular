import { Component, OnInit, HostListener } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-confirm-registration-view',
  templateUrl: './confirm-registration-view.component.html',
  styleUrls: ['./confirm-registration-view.component.css']
})
export class ConfirmRegistrationViewComponent implements OnInit {

  messageSuccess: string = "Great! Your account has been confirmed. Feel free to sign in";
  messageFailure: string = "Sorry, your account could not be confirmed!";
  messageToBeShown: string;

  token: string;
  validating: boolean;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private titleService: Title) {

  }

  ngOnInit(): void {
    this.validating = true;
    this.route.params.subscribe(params => this.token = params["token"]);
    this.titleService.setTitle("Registration confirm");

    let params = new HttpParams().set("token", this.token);

    this.http.post<number>(environment.apiUrl + 'players/confirmRegistration', params)
    .subscribe(
      () => {
        this.messageToBeShown = this.messageSuccess;
        this.validating = false;
      },
      (error) => {
        this.messageToBeShown = this.messageFailure;
        this.validating = false;
      }
    );

  }

}
