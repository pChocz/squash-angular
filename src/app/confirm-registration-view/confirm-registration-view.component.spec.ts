import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {ConfirmRegistrationViewComponent} from './confirm-registration-view.component';

describe('ConfirmRegistrationViewComponent', () => {
    let component: ConfirmRegistrationViewComponent;
    let fixture: ComponentFixture<ConfirmRegistrationViewComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ConfirmRegistrationViewComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfirmRegistrationViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
