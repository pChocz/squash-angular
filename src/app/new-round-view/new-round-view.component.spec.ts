import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRoundViewComponent } from './new-round-view.component';

describe('NewRoundViewComponent', () => {
  let component: NewRoundViewComponent;
  let fixture: ComponentFixture<NewRoundViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRoundViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRoundViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
