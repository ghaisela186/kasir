import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaporanComponent } from './laporan.component';

describe('LaporanComponent', () => {
  let component: LaporanComponent;
  let fixture: ComponentFixture<LaporanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LaporanComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LaporanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
