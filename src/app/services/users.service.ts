import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = 'http://localhost:5000/api/users';

  constructor(private http: HttpClient) {}

  getHeaders() {
    const token = localStorage.getItem('token'); // Ambil token dari localStorage
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  addUser(user: any): Observable<any> {
    return this.http.post(this.apiUrl, user, { headers: this.getHeaders() });
  }

  updateUser(user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${user.id_user}`, user, { headers: this.getHeaders() });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
