import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeforeLoginOtherActionsComponent } from './before-login-other-actions.component';

describe('BeforeLoginOtherActionsComponent', () => {
  let component: BeforeLoginOtherActionsComponent;
  let fixture: ComponentFixture<BeforeLoginOtherActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeforeLoginOtherActionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeforeLoginOtherActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
