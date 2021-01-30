import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NotFoundMessageComponent } from './not-found-message.component';

describe('NotFoundMessageComponent', () => {
  let component: NotFoundMessageComponent;
  let fixture: ComponentFixture<NotFoundMessageComponent>;

  beforeEach(waitForAsync(() => {
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
