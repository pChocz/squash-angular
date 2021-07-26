import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {SeasonViewComponent} from './season-view.component';

describe('SeasonViewComponent', () => {
  let component: SeasonViewComponent;
  let fixture: ComponentFixture<SeasonViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SeasonViewComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeasonViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
