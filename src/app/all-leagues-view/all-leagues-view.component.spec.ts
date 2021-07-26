import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {AllLeaguesViewComponent} from './all-leagues-view.component';

describe('AllLeaguesViewComponent', () => {
  let component: AllLeaguesViewComponent;
  let fixture: ComponentFixture<AllLeaguesViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AllLeaguesViewComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllLeaguesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
