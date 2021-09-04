import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {RecreateRoundViewComponent} from './recreate-round-view.component';

describe('RecreateRoundViewComponent', () => {
  let component: RecreateRoundViewComponent;
  let fixture: ComponentFixture<RecreateRoundViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RecreateRoundViewComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecreateRoundViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
