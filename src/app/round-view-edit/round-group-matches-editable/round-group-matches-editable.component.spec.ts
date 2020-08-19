import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundGroupMatchesEditableComponent } from './round-group-matches-editable.component';

describe('RoundGroupMatchesEditableComponent', () => {
  let component: RoundGroupMatchesEditableComponent;
  let fixture: ComponentFixture<RoundGroupMatchesEditableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoundGroupMatchesEditableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundGroupMatchesEditableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
