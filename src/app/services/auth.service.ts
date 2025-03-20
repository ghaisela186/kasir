import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  public userSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res: any) => {
        console.log('✅ Login berhasil, data diterima:', res);
  
        const token = res.token;
  
        if (token) {
          localStorage.setItem('token', token);
  
          // Decode payload dari JWT token
          const payload = JSON.parse(atob(token.split('.')[1]));
          console.log('✅ JWT Payload:', payload);
  
          const role = payload.role;
          const username = payload.username || payload.email; 
          const id_user = payload.id_user;
  
          this.saveAuthData(token, role, username);
          this.setUserId(id_user);
        } else {
          console.error('❌ Token tidak ditemukan di response!');
          throw new Error('Token tidak ditemukan');
        }
      }),
      catchError(this.handleError)
    );
  }
  

  saveAuthData(token: string, role: string, username: string): void {
    if (typeof window !== 'undefined') {
      console.log('✅ Menyimpan ke localStorage:', { token, role, username }); 
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('username', username); 
      
      this.isLoggedInSubject.next(true);
      this.userSubject.next({ username, role });
    }
  }  

  getUserFromStorage() {
    if (typeof window === 'undefined') return { username: '', role: '' };

    return {
      username: localStorage.getItem('username') || '',
      role: localStorage.getItem('role') || '',
    };
  }

  getToken(): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  }

  getRole(): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem('role') : null;
  }

  // ✅ FIXED: Langsung ambil dari localStorage
  getUsername(): string {
    if (typeof window === 'undefined') return 'Unknown';

    const username = localStorage.getItem('username');
    console.log('👤 Username dari localStorage:', username);

    return username || 'Unknown';
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // ✅ Simpan ID user saat login
  setUserId(id: number) {
    localStorage.setItem('id_user', id.toString());
  }

  // ✅ Ambil ID user yang login (masih decode token karena di token ada id_user)
  getUserId() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Decoded Token Payload:', payload);
      return payload.id_user;
    } catch (err) {
      console.error('Error decoding token:', err);
      return null;
    }
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('username');
      localStorage.removeItem('id_user');
    }

    this.isLoggedInSubject.next(false);
    this.userSubject.next(null);
  }

  addAuthorizationHeader() {
    const token = this.getToken();
    if (!token) {
      console.error('🚨 Token tidak ditemukan di localStorage!');
      return { headers: new HttpHeaders() };
    }

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }),
    };
  }

  private handleError(error: any): Observable<never> {
    console.error('Terjadi kesalahan:', error);
    return throwError(() => new Error(error.message || 'Terjadi kesalahan'));
  }
}
