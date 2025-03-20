import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TransaksiService {

  // ✅ Pastikan endpoint benar sesuai backend kamu
  private apiUrl = 'http://localhost:5000/api/transaksi';
  private laporanUrl = 'http://localhost:5000/api/laporan';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); 
  
    if (!token) {
      console.error("❌ Token tidak ditemukan di localStorage!");
      return new HttpHeaders({ 'Content-Type': 'application/json' });
    }
  
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // ✅ Ambil daftar pelanggan
  getPelanggan(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pelanggan`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          console.error('❌ Error fetching pelanggan:', error);
          return throwError(() => new Error('Gagal mengambil daftar pelanggan'));
        })
      );
  }

  // ✅ Cari barang berdasarkan barcode
  getBarangByKode(kode: string): Observable<any> {
    if (!kode.trim()) {
      console.warn("⚠️ Kode barang kosong, request dibatalkan.");
      return throwError(() => new Error('Kode barang tidak boleh kosong'));
    }

    console.log('🔍 Mengirim request ke backend:', kode);

    return this.http.get(`${this.apiUrl}/barang/${kode}`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          console.error(`❌ Error fetching barang dengan kode ${kode}:`, error);
          return throwError(() => new Error('Barang tidak ditemukan atau terjadi kesalahan server'));
        })
      );
  }

  // ✅ Simpan transaksi baru
  simpanTransaksi(data: any): Observable<any> {
    if (!data || !data.items || data.items.length === 0) {
      console.warn("⚠️ Data transaksi tidak valid, request dibatalkan.");
      return throwError(() => new Error('Data transaksi tidak boleh kosong'));
    }

    console.log('💾 Mengirim transaksi ke backend:', data);

    return this.http.post(`${this.apiUrl}`, data, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          console.error('❌ Error dari backend (HTTP POST transaksi):', error);
          return throwError(() => new Error(error?.error?.message || 'Gagal menyimpan transaksi, coba lagi nanti'));
        })
      );
  }

  // ✅ Ambil laporan transaksi (untuk halaman laporan utama)
  getLaporan(params?: any): Observable<any> {
    const headers = this.getHeaders();

    let httpParams = new HttpParams();
    if (params) {
      if (params.start_date) {
        httpParams = httpParams.set('start_date', params.start_date);
      }
      if (params.end_date) {
        httpParams = httpParams.set('end_date', params.end_date);
      }
    }

    return this.http.get(`${this.apiUrl}/laporan`, {
      headers: headers,
      params: httpParams
    }).pipe(
      catchError(error => {
        console.error('❌ Error fetching laporan:', error);
        return throwError(() => new Error('Gagal mengambil laporan'));
      })
    );
  }


}
