import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailLaporanComponent } from './detail-laporan.component';

describe('DetailLaporanComponent', () => {
  let component: DetailLaporanComponent;
  let fixture: ComponentFixture<DetailLaporanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailLaporanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailLaporanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
