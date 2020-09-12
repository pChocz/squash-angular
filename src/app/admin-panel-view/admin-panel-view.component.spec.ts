import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPanelViewComponent } from './admin-panel-view.component';

describe('AdminPanelViewComponent', () => {
  let component: AdminPanelViewComponent;
  let fixture: ComponentFixture<AdminPanelViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPanelViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPanelViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
