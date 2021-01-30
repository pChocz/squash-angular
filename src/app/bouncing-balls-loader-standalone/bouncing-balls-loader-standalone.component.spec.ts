import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BouncingBallsLoaderStandaloneComponent } from './bouncing-balls-loader-standalone.component';

describe('BouncingBallsLoaderStandaloneComponent', () => {
  let component: BouncingBallsLoaderStandaloneComponent;
  let fixture: ComponentFixture<BouncingBallsLoaderStandaloneComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BouncingBallsLoaderStandaloneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BouncingBallsLoaderStandaloneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
