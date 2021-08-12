import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GdprPolicyViewComponent } from './gdpr-policy-view.component';

describe('GdprPolicyViewComponent', () => {
  let component: GdprPolicyViewComponent;
  let fixture: ComponentFixture<GdprPolicyViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GdprPolicyViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GdprPolicyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
