import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-bouncing-balls-loader-sync',
  templateUrl: './bouncing-balls-loader-sync.component.html',
  styleUrls: ['./bouncing-balls-loader-sync.component.css']
})
export class BouncingBallsLoaderSyncComponent implements OnInit {

  @Input() message: string;

  constructor() {
  }

  ngOnInit(): void {
  }

}
