import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  logoSanitized: SafeResourceUrl;
  panelOpenState = false;

  constructor(private sanitizer: DomSanitizer, private http : HttpClient) { }

  ngOnInit(): void {
    this.http.get('assets/img/dziadoliga_logo_base64.txt', {responseType: 'text'})
    .subscribe(data => {
      this.logoSanitized = this.sanitizer.bypassSecurityTrustResourceUrl("data:Image/*;base64," + data);
    });
  }

}
