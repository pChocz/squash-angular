import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CountUpTileTripleComponent} from './count-up-tile-triple.component';

describe('CountUpTileTripleComponent', () => {
    let component: CountUpTileTripleComponent;
    let fixture: ComponentFixture<CountUpTileTripleComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CountUpTileTripleComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CountUpTileTripleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
