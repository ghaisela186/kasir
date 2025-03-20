import { Injectable } from '@angular/core'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  // ✅ Sesuaikan base URL backend API-mu
  private apiUrl = 'http://localhost:5000/api/dashboard';

  constructor(private http: HttpClient) { }

  // ✅ Ambil data statistik dashboard (bulanan/tahunan)
  getDashboardData(mode: string = 'bulanan') {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Kirim mode sebagai query param, contoh: /api/dashboard?mode=bulanan
    return this.http.get(`${this.apiUrl}?mode=${mode}`, { headers });
  }

  // ✅ Ambil data stok menipis
  getStokMenipis() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(`${this.apiUrl}/stok-menipis`, { headers });
  }
}
