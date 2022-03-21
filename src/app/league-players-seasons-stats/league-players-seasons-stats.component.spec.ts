import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaguePlayersSeasonsStatsComponent } from './league-players-seasons-stats.component';

describe('LeaguePlayersSeasonsStatsComponent', () => {
  let component: LeaguePlayersSeasonsStatsComponent;
  let fixture: ComponentFixture<LeaguePlayersSeasonsStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaguePlayersSeasonsStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaguePlayersSeasonsStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
