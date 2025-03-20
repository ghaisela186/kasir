import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class KategoriService {
  private apiUrl = 'http://localhost:5000/api/kategori'; // Pastikan sesuai backend

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // ✅ Reusable Authorization Header
  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return { headers };}

    // ✅ Ambil semua kategori
  getAll(): Observable<any[]> {
    console.log('✅ Memuat daftar kategori...');
    return this.http.get<any[]>(this.apiUrl, this.getAuthHeaders());
  }

  editKategori(id: number, data: any): Observable<any> {
    console.log('✏️ Mengupdate kategori dengan ID:', id);
    return this.http.put(`${this.apiUrl}/${id}`, data, this.getAuthHeaders());
  }

  tambahKategori(data: any): Observable<any> {
    console.log('📤 Menambahkan kategori:', data);
    return this.http.post(this.apiUrl, data, this.getAuthHeaders());
  }

  hapusKategori(id: string): Observable<any> {
    const headers = this.authService.addAuthorizationHeader().headers;
    console.log(`🗑 Menghapus kategori dengan ID: ${id}`);
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }  
}

