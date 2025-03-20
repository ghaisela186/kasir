import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loginError: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  login() {
    this.loginError = null;

    if (!this.email || !this.password) {
      this.loginError = 'Email dan password wajib diisi.';
      return;
    }

    console.log('📩 Mengirim data login:', { email: this.email, password: this.password });

    this.authService.login(this.email, this.password).subscribe({
      next: (response: any) => {
        console.log('🔍 Response dari server:', response);

        if (response.token && response.role && response.username) {
          // ✅ Simpan data auth di localStorage
          this.authService.saveAuthData(response.token, response.role, response.username);

          console.log('✅ Login berhasil!');

          // ✅ Redirect sesuai role
          if (response.role === 'admin') {
            this.router.navigate(['/home']);
          } else if (response.role === 'petugas') {
            this.router.navigate(['/transaksi']);
          } else {
            // Jika role tidak dikenal, logout
            console.warn('🚨 Role tidak dikenali!');
            this.authService.logout();
            this.router.navigate(['/login']);
          }

        } else {
          console.error('🚨 Response tidak sesuai:', response);
          this.loginError = 'Terjadi kesalahan saat login. Silakan coba lagi.';
        }
      },
      error: (error: any) => {
        console.error('❌ Error dari server:', error);
        if (error.status === 401) {
          this.loginError = 'Email atau password salah.';
        } else {
          this.loginError = 'Terjadi kesalahan. Silakan coba lagi.';
        }
      },
    });
  }

  clearError() {
    this.loginError = null;
  }
}
