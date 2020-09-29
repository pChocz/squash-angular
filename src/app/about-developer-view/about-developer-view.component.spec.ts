import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutDeveloperViewComponent } from './about-developer-view.component';

describe('AboutAppViewComponent', () => {
  let component: AboutDeveloperViewComponent;
  let fixture: ComponentFixture<AboutDeveloperViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutDeveloperViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutDeveloperViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
