import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendataanBarangComponent } from './pendataan-barang.component';

describe('PendataanBarangComponent', () => {
  let component: PendataanBarangComponent;
  let fixture: ComponentFixture<PendataanBarangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PendataanBarangComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendataanBarangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
