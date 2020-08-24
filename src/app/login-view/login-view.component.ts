import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { debuglog } from 'util';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { HttpClient, HttpParams, HttpBackend } from '@angular/common/http';
import { environment } from 'src/environments/environment';

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

  constructor(private http: HttpClient,
    private handler: HttpBackend,
    private router: Router,
    private snackBar: MatSnackBar,
    private titleService: Title) {

    this.http = new HttpClient(handler);
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

    let params = new HttpParams()
      .set("usernameOrEmail", this.username)
      .set("password", this.password);


    this.http.post<any>(environment.apiUrl + 'login', params, { observe: "response" as 'body' }).subscribe(
      result => {
        console.log("Logging in with CORRECT credentials");
        console.log(result);

        let jwtBearerToken: string = result.headers.get('Authorization');
        console.log(jwtBearerToken)

        localStorage.setItem("token", jwtBearerToken);

        this.snackBar.open(this.messageCorrectLogin, "X", {
          duration: this.durationInSeconds * 1000,
          panelClass: ['mat-toolbar', 'mat-primary']
        });

        this.router.navigate([`/leagues`]);


      },
      error => {
        console.log("Logging in with WRONG credentials");
        console.log(error);

        this.snackBar.open(this.messageIncorrectCredentials, "X", {
          duration: this.durationInSeconds * 1000,
          panelClass: ['mat-toolbar', 'mat-warn']
        });
        this.password = "";

      }
    );
  }

  @HostListener('document:keydown', ['$event'])
  handleDeleteKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter' && !this.isEmptyInput()) {
      this.login();
    }
  }

}
