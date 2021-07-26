import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {CssSpinnerComponent} from './css-spinner.component';

describe('CssSpinnerComponent', () => {
  let component: CssSpinnerComponent;
  let fixture: ComponentFixture<CssSpinnerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CssSpinnerComponent]
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
