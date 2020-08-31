import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CookiePolicyViewComponent } from './cookie-policy-view.component';

describe('CookiePolicyViewComponent', () => {
  let component: CookiePolicyViewComponent;
  let fixture: ComponentFixture<CookiePolicyViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CookiePolicyViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CookiePolicyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
