import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XpPointsViewComponent } from './xp-points-view.component';

describe('XpPointsViewComponent', () => {
  let component: XpPointsViewComponent;
  let fixture: ComponentFixture<XpPointsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XpPointsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XpPointsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
