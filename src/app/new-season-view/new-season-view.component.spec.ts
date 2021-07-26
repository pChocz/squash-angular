import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {NewSeasonViewComponent} from './new-season-view.component';

describe('NewSeasonViewComponent', () => {
  let component: NewSeasonViewComponent;
  let fixture: ComponentFixture<NewSeasonViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NewSeasonViewComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSeasonViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
