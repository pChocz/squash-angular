import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSeasonViewComponent } from './new-season-view.component';

describe('NewSeasonViewComponent', () => {
  let component: NewSeasonViewComponent;
  let fixture: ComponentFixture<NewSeasonViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSeasonViewComponent ]
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
