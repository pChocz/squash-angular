import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-winning-balance',
  templateUrl: './winning-balance.component.html',
  styleUrls: ['./winning-balance.component.css']
})
export class WinningBalanceComponent implements OnInit {

  @Input() winningCount: number;
  @Input() directMatchesLost: number;
  @Input() allWinningsCount: number;
  @Input() balanceType: string;

  constructor() { }

  ngOnInit(): void {
  }

}
