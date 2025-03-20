import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProdukService {
  private apiUrl = 'http://localhost:5000/api/produk';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return { headers };
  }

  getAll(): Observable<any[]> {
    console.log('📦 Memuat daftar produk...');
    return this.http.get<any[]>(this.apiUrl, this.getAuthHeaders());
  }

  getById(id: number): Observable<any> {
    console.log('🔎 Mengambil produk ID:', id);
    return this.http.get(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  create(data: any): Observable<any> {
    console.log('➕ Menambah produk:', data);
    return this.http.post(this.apiUrl, data, this.getAuthHeaders());
  }

  update(id: number, data: any): Observable<any> {
    console.log('✏️ Mengupdate produk ID:', id);
    return this.http.put(`${this.apiUrl}/${id}`, data, this.getAuthHeaders());
  }

  delete(id: number): Observable<any> {
    console.log('🗑 Menghapus produk ID:', id);
    return this.http.delete(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }
}
