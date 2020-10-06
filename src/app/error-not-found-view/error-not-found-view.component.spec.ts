import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorNotFoundViewComponent } from './error-not-found-view.component';

describe('ErrorNotFoundViewComponent', () => {
  let component: ErrorNotFoundViewComponent;
  let fixture: ComponentFixture<ErrorNotFoundViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorNotFoundViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorNotFoundViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
