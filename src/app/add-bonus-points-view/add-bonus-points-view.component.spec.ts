import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBonusPointsViewComponent } from './add-bonus-points-view.component';

describe('AddBonusPointsViewComponent', () => {
  let component: AddBonusPointsViewComponent;
  let fixture: ComponentFixture<AddBonusPointsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBonusPointsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBonusPointsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
