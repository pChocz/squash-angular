import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {CookiePolicyViewComponent} from './cookie-policy-view.component';

describe('CookiePolicyViewComponent', () => {
    let component: CookiePolicyViewComponent;
    let fixture: ComponentFixture<CookiePolicyViewComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [CookiePolicyViewComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CookiePolicyViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
