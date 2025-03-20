import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LaporanService } from '../../services/laporan.service';
import { TransaksiService } from '../../services/transaksi.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-laporan',
  templateUrl: './laporan.component.html',
  styleUrls: ['./laporan.component.css']
})
export class LaporanComponent implements OnInit {
  laporan: any[] = [];
  startDate: string = '';
  endDate: string = '';

  constructor(
    private laporanService: LaporanService,
    private transaksiService: TransaksiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getLaporan();
  }

  getLaporan(): void {
    const params: any = {};

    if (this.startDate && this.endDate) {
      params.start_date = this.startDate;
      params.end_date = this.endDate;
    }

    this.transaksiService.getLaporan(params).subscribe({
      next: (data) => { this.laporan = data; },
      error: (err) => {
        console.error('❌ Gagal mengambil laporan:', err);
        alert('Terjadi kesalahan saat mengambil laporan!');
      }
    });
  }

  resetFilter(): void {
    this.startDate = '';
    this.endDate = '';
    this.getLaporan();
  }

  lihatDetail(id_penjualan: number) {
    this.router.navigate(['/laporan/detail', id_penjualan]);
  }

  cetakLaporan(): void {
    const printContents = document.getElementById('laporan-print')?.innerHTML;
    const originalContents = document.body.innerHTML;

    if (printContents) {
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  }

  exportExcel(): void {
    if (this.laporan.length === 0) {
      alert('Tidak ada data untuk diexport!');
      return;
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      this.laporan.map((item, index) => ({
        'No': index + 1,
        'ID Penjualan': item.id_penjualan,
        'Tanggal': item.tanggal_penjualan,
        'Kasir': item.nama_user,
        'Pelanggan': item.nama_pelanggan || 'Umum',
        'Diskon (%)': item.diskon,
        'Total Harga (Rp)': item.total_harga,
      }))
    );

    const workbook: XLSX.WorkBook = { Sheets: { 'Laporan Penjualan': worksheet }, SheetNames: ['Laporan Penjualan'] };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const fileName = `Laporan_Penjualan_${new Date().toISOString().slice(0, 10)}.xlsx`;
    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    FileSaver.saveAs(data, fileName);
    alert('✅ Laporan berhasil diexport ke Excel!');
  }
}
