import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrophyIconComponent } from './trophy-icon.component';

describe('TrophyIconComponent', () => {
  let component: TrophyIconComponent;
  let fixture: ComponentFixture<TrophyIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrophyIconComponent ]
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
