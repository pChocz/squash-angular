import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CssSpinnerComponent } from './css-spinner.component';

describe('CssSpinnerComponent', () => {
  let component: CssSpinnerComponent;
  let fixture: ComponentFixture<CssSpinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CssSpinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CssSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
