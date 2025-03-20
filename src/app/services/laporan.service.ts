import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LaporanService {

  private apiUrl = 'http://localhost:5000/api/laporan';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('⚠️ Token tidak ditemukan!');
      return new HttpHeaders({ 'Content-Type': 'application/json' });
    }

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // ✅ Ambil semua laporan penjualan
  getLaporan(): Observable<any> {
    return this.http.get(`${this.apiUrl}/penjualan`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        console.error('❌ Error fetching laporan penjualan:', error);
        return throwError(() => new Error('Gagal mengambil laporan penjualan'));
      })
    );
  }

  // ✅ Ambil detail transaksi penjualan berdasarkan id_penjualan
  getDetailLaporan(id_penjualan: number | string): Observable<any> {
    if (!id_penjualan) {
      console.warn('⚠️ ID penjualan tidak valid');
      return throwError(() => new Error('ID penjualan tidak boleh kosong'));
    }

    return this.http.get(`${this.apiUrl}/detail/${id_penjualan}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        console.error('❌ Error fetching detail laporan:', error);
        return throwError(() => new Error('Gagal mengambil detail laporan'));
      })
    );
  }
}
