import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LaporanService } from '../../services/laporan.service'; // ✅ Ganti service-nya!

@Component({
  selector: 'app-detail-laporan',
  templateUrl: './detail-laporan.component.html',
  styleUrls: ['./detail-laporan.component.css']
})
export class DetailLaporanComponent implements OnInit {

  detailLaporan: any[] = [];
  transaksiInfo: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private laporanService: LaporanService // ✅ Pakai LaporanService
  ) {}

  ngOnInit(): void {
    const id_penjualan = this.route.snapshot.paramMap.get('id_penjualan');
    console.log('✅ id_penjualan:', id_penjualan);
  
    if (id_penjualan) {
      this.getDetailLaporan(id_penjualan);
    } else {
      console.error('❌ Tidak ada id_penjualan di route!');
    }
  }
  

  getDetailLaporan(id_penjualan: string) {
    this.laporanService.getDetailLaporan(id_penjualan).subscribe({
      next: (data) => {
        console.log("✅ Detail laporan ditemukan:", data);
        this.transaksiInfo = data.transaksi || null;
        this.detailLaporan = data.detail_barang || [];

         // Tambah log:
      console.log('📋 transaksiInfo:', this.transaksiInfo);
      console.log('📋 detailLaporan:', this.detailLaporan);
      },
      error: (err) => {
        console.error('❌ Gagal ambil detail laporan:', err);
        alert('Gagal mengambil detail laporan');
      }
    });
  }

  goBack() {
    this.router.navigate(['/laporan']);
  }
}
