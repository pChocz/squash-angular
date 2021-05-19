import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {BonusPointsTableComponent} from './bonus-points-table.component';

describe('BonusPointsTableComponent', () => {
    let component: BonusPointsTableComponent;
    let fixture: ComponentFixture<BonusPointsTableComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [BonusPointsTableComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BonusPointsTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
