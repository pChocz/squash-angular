import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonsStatsScoreboardComponent } from './seasons-stats-scoreboard.component';

describe('SeasonsStatsScoreboardComponent', () => {
  let component: SeasonsStatsScoreboardComponent;
  let fixture: ComponentFixture<SeasonsStatsScoreboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeasonsStatsScoreboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeasonsStatsScoreboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
