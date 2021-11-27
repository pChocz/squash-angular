import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogInUsingMagicLinkViewComponent } from './log-in-using-magic-link-view.component';

describe('LogInUsingMagicLinkViewComponent', () => {
  let component: LogInUsingMagicLinkViewComponent;
  let fixture: ComponentFixture<LogInUsingMagicLinkViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogInUsingMagicLinkViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogInUsingMagicLinkViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
