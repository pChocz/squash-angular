import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentSeasonComponent } from './current-season.component';

describe('CurrentSeasonComponent', () => {
  let component: CurrentSeasonComponent;
  let fixture: ComponentFixture<CurrentSeasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentSeasonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentSeasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
