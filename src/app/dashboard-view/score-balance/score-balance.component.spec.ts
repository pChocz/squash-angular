import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {ScoreBalanceComponent} from './score-balance.component';

describe('ScoreBalanceComponent', () => {
    let component: ScoreBalanceComponent;
    let fixture: ComponentFixture<ScoreBalanceComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ScoreBalanceComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ScoreBalanceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
