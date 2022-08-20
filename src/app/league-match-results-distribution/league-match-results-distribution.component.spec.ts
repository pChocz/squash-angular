import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeagueMatchResultsDistributionComponent } from './league-match-results-distribution.component';

describe('LeagueMatchResultsDistributionComponent', () => {
  let component: LeagueMatchResultsDistributionComponent;
  let fixture: ComponentFixture<LeagueMatchResultsDistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeagueMatchResultsDistributionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeagueMatchResultsDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
