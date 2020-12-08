import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundMatchesPrintableViewComponent } from './round-matches-printable-view.component';

describe('RoundMatchesPrintableViewComponent', () => {
  let component: RoundMatchesPrintableViewComponent;
  let fixture: ComponentFixture<RoundMatchesPrintableViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoundMatchesPrintableViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundMatchesPrintableViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
