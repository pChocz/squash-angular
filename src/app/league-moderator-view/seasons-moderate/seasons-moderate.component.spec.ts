import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonsModerateComponent } from './seasons-moderate.component';

describe('SeasonsModerateComponent', () => {
  let component: SeasonsModerateComponent;
  let fixture: ComponentFixture<SeasonsModerateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeasonsModerateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeasonsModerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
