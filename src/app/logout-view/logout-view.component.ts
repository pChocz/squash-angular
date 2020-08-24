import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-logout-view',
  templateUrl: './logout-view.component.html',
  styleUrls: ['./logout-view.component.css']
})
export class LogoutViewComponent implements OnInit {

  durationInSeconds = 7;

  messageLogout : string = "You have been succesfully logged out.";

  constructor(private router: Router, private snackBar: MatSnackBar) { 

    // clearing the token
    localStorage.removeItem("token");

    this.snackBar.open(this.messageLogout, "X", {
      duration: this.durationInSeconds * 1000,
      panelClass: ['mat-toolbar', 'mat-primary']
    });

    this.router.navigate([`/login`]);
  }

  ngOnInit(): void {
  }

}
