import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HeadToHeadChartComponent} from './head-to-head-chart.component';

describe('HeadToHeadChartComponent', () => {
  let component: HeadToHeadChartComponent;
  let fixture: ComponentFixture<HeadToHeadChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeadToHeadChartComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadToHeadChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
