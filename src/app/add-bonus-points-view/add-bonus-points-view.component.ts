import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-bonus-points-view',
  templateUrl: './add-bonus-points-view.component.html',
  styleUrls: ['./add-bonus-points-view.component.css']
})
export class AddBonusPointsViewComponent implements OnInit {

  seasonUuid: string;

  constructor(private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private titleService: Title) {

    this.titleService.setTitle("New season");

    this.route.queryParams.subscribe(
      params => {
        this.seasonUuid = params["seasonUuid"];
        console.log(this.seasonUuid);
      });
      
  }

  ngOnInit(): void {
  }

}
