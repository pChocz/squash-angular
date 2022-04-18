import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLostBallsViewComponent } from './add-lost-balls-view.component';

describe('AddLostBallsViewComponent', () => {
  let component: AddLostBallsViewComponent;
  let fixture: ComponentFixture<AddLostBallsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLostBallsViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLostBallsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
