import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RoundGroupMatchesComponent } from './round-group-matches.component';

describe('RoundGroupMatchesComponent', () => {
    let component: RoundGroupMatchesComponent;
    let fixture: ComponentFixture<RoundGroupMatchesComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [RoundGroupMatchesComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RoundGroupMatchesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
