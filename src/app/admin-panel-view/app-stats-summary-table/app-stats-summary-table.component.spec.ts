import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AppStatsSummaryTableComponent} from './app-stats-summary-table.component';

describe('AppStatsSummaryTableComponent', () => {
  let component: AppStatsSummaryTableComponent;
  let fixture: ComponentFixture<AppStatsSummaryTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppStatsSummaryTableComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppStatsSummaryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
