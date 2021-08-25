import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourtCalculatorViewComponent } from './court-calculator-view.component';

describe('CourtCalculatorViewComponent', () => {
  let component: CourtCalculatorViewComponent;
  let fixture: ComponentFixture<CourtCalculatorViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourtCalculatorViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourtCalculatorViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
