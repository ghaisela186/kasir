import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PelangganService {
  private apiUrl = 'http://localhost:5000/api/pelanggan';

  constructor(private http: HttpClient) {}

  // Fungsi untuk mendapatkan token dari localStorage
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Pastikan token tersimpan di localStorage saat login
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getPelanggan(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getPelangganById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  addPelanggan(pelanggan: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, pelanggan, { headers: this.getHeaders() });
  }

  updatePelanggan(id: number, pelanggan: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, pelanggan, { headers: this.getHeaders() });
  }

  deletePelanggan(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
