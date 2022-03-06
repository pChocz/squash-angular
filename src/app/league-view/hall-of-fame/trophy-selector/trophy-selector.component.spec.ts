import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrophySelectorComponent } from './trophy-selector.component';

describe('TrophySelectorComponent', () => {
  let component: TrophySelectorComponent;
  let fixture: ComponentFixture<TrophySelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrophySelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrophySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
