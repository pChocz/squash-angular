import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {AboutAppViewComponent} from './about-app-view.component';

describe('AboutAppViewComponent', () => {
  let component: AboutAppViewComponent;
  let fixture: ComponentFixture<AboutAppViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AboutAppViewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutAppViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
