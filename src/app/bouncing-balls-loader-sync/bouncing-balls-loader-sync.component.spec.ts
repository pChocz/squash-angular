import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BouncingBallsLoaderSyncComponent } from './bouncing-balls-loader-sync.component';

describe('BouncingBallsLoaderSyncComponent', () => {
  let component: BouncingBallsLoaderSyncComponent;
  let fixture: ComponentFixture<BouncingBallsLoaderSyncComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BouncingBallsLoaderSyncComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BouncingBallsLoaderSyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
