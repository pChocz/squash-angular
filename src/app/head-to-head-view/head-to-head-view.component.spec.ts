import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadToHeadViewComponent } from './head-to-head-view.component';

describe('HeadToHeadViewComponent', () => {
  let component: HeadToHeadViewComponent;
  let fixture: ComponentFixture<HeadToHeadViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeadToHeadViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadToHeadViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
