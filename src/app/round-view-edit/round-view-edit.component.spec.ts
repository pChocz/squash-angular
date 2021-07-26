import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {RoundViewEditComponent} from './round-view-edit.component';

describe('RoundViewEditComponent', () => {
  let component: RoundViewEditComponent;
  let fixture: ComponentFixture<RoundViewEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RoundViewEditComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundViewEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
