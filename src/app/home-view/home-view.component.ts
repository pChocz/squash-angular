import {Component, OnInit} from '@angular/core';
import {AuthService} from "../shared/auth.service";
import {Router} from "@angular/router";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.css']
})
export class HomeViewComponent implements OnInit {

  constructor(private authService: AuthService,
              private router: Router,
              private titleService: Title) {

  }

  ngOnInit(): void {
    this.titleService.setTitle('Squash App');

    if (this.authService.hasJwtToken() && this.authService.isUser()) {
      this.router.navigate([`/dashboard`]);
    } else {
      this.router.navigate([`/login`]);
    }
  }

}
