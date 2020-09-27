import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-new-season-view',
  templateUrl: './new-season-view.component.html',
  styleUrls: ['./new-season-view.component.css']
})
export class NewSeasonViewComponent implements OnInit {

  leagueUuid: string;

  constructor(private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private titleService: Title) {

    this.titleService.setTitle("New season");

    this.route.queryParams.subscribe(
      params => {
        this.leagueUuid = params["leagueUuid"];
        console.log(this.leagueUuid);
      });
      
  }

  ngOnInit(): void {
  }

}
