import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RoundViewComponent } from './round-view.component';

describe('RoundViewComponent', () => {
  let component: RoundViewComponent;
  let fixture: ComponentFixture<RoundViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RoundViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
