import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotFoundMessageComponent } from './not-found-message.component';

describe('NotFoundMessageComponent', () => {
  let component: NotFoundMessageComponent;
  let fixture: ComponentFixture<NotFoundMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotFoundMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotFoundMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
