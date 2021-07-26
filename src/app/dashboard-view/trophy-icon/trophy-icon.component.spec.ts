import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {TrophyIconComponent} from './trophy-icon.component';

describe('TrophyIconComponent', () => {
  let component: TrophyIconComponent;
  let fixture: ComponentFixture<TrophyIconComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TrophyIconComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrophyIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
