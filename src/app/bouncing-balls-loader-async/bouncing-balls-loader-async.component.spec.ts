import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BouncingBallsLoaderAsyncComponent } from './bouncing-balls-loader-async.component';

describe('BouncingBallsLoaderSyncComponent', () => {
  let component: BouncingBallsLoaderAsyncComponent;
  let fixture: ComponentFixture<BouncingBallsLoaderAsyncComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BouncingBallsLoaderAsyncComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BouncingBallsLoaderAsyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
