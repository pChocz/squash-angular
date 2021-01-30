import { Component, OnInit } from '@angular/core';
import {AuthService} from "../shared/auth.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.css']
})
export class HomeViewComponent implements OnInit {

  constructor(
      private authService: AuthService,
      private router: Router) { }

  ngOnInit(): void {

    console.log('dupa');


    if (this.authService.hasAnyToken() && this.authService.isUser()) {
      this.router.navigate([`/dashboard`]);
      console.log('user');
    } else {
      this.router.navigate([`/login`]);
      console.log('no user');
    }

  }

}
