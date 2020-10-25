import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { HttpClient, HttpParams, HttpBackend } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login-view',
  templateUrl: './login-view.component.html',
  styleUrls: ['./login-view.component.css'],
})
export class LoginViewComponent implements OnInit {
  durationInSeconds = 7;
  messageIncorrectCredentials = 'Incorrect username/email or password.';
  messageCorrectLogin = 'You have been succesfully signed in.';
  loadingMessage = 'Signing in';

  hide: boolean;
  isLoading: boolean;
  username = '';
  password = '';

  constructor(
    private http: HttpClient,
    private handler: HttpBackend,
    private router: Router,
    private snackBar: MatSnackBar,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.http = new HttpClient(this.handler);
    this.titleService.setTitle('Sign in');
    this.hide = true;
    this.isLoading = false;
  }

  isEmptyInput(): boolean {
    return this.username.length === 0 || this.password.length === 0;
  }

  login(): void {
    this.isLoading = true;

    const params = new HttpParams()
      .set('usernameOrEmail', this.username)
      .set('password', this.password);

    this.http
      .post<any>(environment.apiUrl + 'login', params, {
        observe: 'response' as 'body',
      })
      .subscribe(
        (result) => {
          console.log('Logging in with CORRECT credentials');

          const jwtBearerToken: string = result.headers.get('Authorization');
          localStorage.setItem('token', jwtBearerToken);

          this.snackBar.open(this.messageCorrectLogin, 'X', {
            duration: this.durationInSeconds * 1000,
            panelClass: ['mat-toolbar', 'mat-primary'],
          });

          this.router.navigate([`/leagues`]);
        },

        (error) => {
          this.isLoading = false;
          this.password = '';

          if (error.status === 0) {
            console.log('Database connection error!', error);
            this.snackBar.open('Database connection error!', 'X', {
              duration: this.durationInSeconds * 1000,
              panelClass: ['mat-toolbar', 'mat-error'],
            });
          } else if (error.status === 401) {
            console.log('Logging in with wrong credentials!', error);
            this.snackBar.open(this.messageIncorrectCredentials, 'X', {
              duration: this.durationInSeconds * 1000,
              panelClass: ['mat-toolbar', 'mat-warn'],
            });
          }
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
