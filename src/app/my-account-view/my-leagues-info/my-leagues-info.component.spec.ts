import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyLeaguesInfoComponent } from './my-leagues-info.component';

describe('MyLeaguesInfoComponent', () => {
  let component: MyLeaguesInfoComponent;
  let fixture: ComponentFixture<MyLeaguesInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyLeaguesInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyLeaguesInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
