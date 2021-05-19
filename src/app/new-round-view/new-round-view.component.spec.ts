import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {NewRoundViewComponent} from './new-round-view.component';

describe('NewRoundViewComponent', () => {
    let component: NewRoundViewComponent;
    let fixture: ComponentFixture<NewRoundViewComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [NewRoundViewComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NewRoundViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
