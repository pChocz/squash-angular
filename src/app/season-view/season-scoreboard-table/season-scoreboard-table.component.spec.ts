import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {SeasonScoreboardTableComponent} from './season-scoreboard-table.component';

describe('SeasonScoreboardTableComponent', () => {
    let component: SeasonScoreboardTableComponent;
    let fixture: ComponentFixture<SeasonScoreboardTableComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [SeasonScoreboardTableComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SeasonScoreboardTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
