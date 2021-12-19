import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmEmailChangeViewComponent } from './confirm-email-change-view.component';

describe('ConfirmEmailChangeViewComponent', () => {
  let component: ConfirmEmailChangeViewComponent;
  let fixture: ComponentFixture<ConfirmEmailChangeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmEmailChangeViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmEmailChangeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
