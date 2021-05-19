import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {PerSeasonStatsComponent} from './per-season-stats.component';

describe('PerSeasonStatsComponent', () => {
    let component: PerSeasonStatsComponent;
    let fixture: ComponentFixture<PerSeasonStatsComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [PerSeasonStatsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PerSeasonStatsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
