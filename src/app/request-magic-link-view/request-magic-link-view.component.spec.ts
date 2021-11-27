import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestMagicLinkViewComponent } from './request-magic-link-view.component';

describe('RequestMagicLinkViewComponent', () => {
  let component: RequestMagicLinkViewComponent;
  let fixture: ComponentFixture<RequestMagicLinkViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestMagicLinkViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestMagicLinkViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
