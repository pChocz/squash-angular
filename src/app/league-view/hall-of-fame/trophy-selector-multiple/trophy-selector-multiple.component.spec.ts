import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrophySelectorMultipleComponent } from './trophy-selector-multiple.component';

describe('TrophySelectorMultipleComponent', () => {
  let component: TrophySelectorMultipleComponent;
  let fixture: ComponentFixture<TrophySelectorMultipleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrophySelectorMultipleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrophySelectorMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
