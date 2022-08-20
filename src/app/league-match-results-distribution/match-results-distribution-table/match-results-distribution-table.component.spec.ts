import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchResultsDistributionTableComponent } from './match-results-distribution-table.component';

describe('MatchResultsDistributionTableComponent', () => {
  let component: MatchResultsDistributionTableComponent;
  let fixture: ComponentFixture<MatchResultsDistributionTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatchResultsDistributionTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchResultsDistributionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
