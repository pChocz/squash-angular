import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaguePlayerRoundsStatsComponent } from './league-player-rounds-stats.component';

describe('LeaguePlayerRoundsStatsComponent', () => {
  let component: LeaguePlayerRoundsStatsComponent;
  let fixture: ComponentFixture<LeaguePlayerRoundsStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaguePlayerRoundsStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaguePlayerRoundsStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
