import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourtCalculatorDetailedViewComponent } from './court-calculator-detailed-view.component';

describe('CourtCalculatorDetailedViewComponent', () => {
  let component: CourtCalculatorDetailedViewComponent;
  let fixture: ComponentFixture<CourtCalculatorDetailedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourtCalculatorDetailedViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourtCalculatorDetailedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
