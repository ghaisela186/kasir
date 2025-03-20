import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  isLoginPage = false;
  role: string | null = null;
  username: string | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.checkLoginStatus(); // Panggil saat pertama kali halaman dimuat

    // Update status login saat terjadi perubahan
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
      this.role = this.authService.getRole();
      this.username = this.authService.getUsername();
    });

    // Pastikan navbar diperbarui saat username berubah
    this.authService.user$.subscribe((user) => {
      this.username = user?.username || null;
    });

    // Redirect ke /login jika belum login dan berada di halaman root "/"
    if (!this.isLoggedIn && this.router.url === '/') {
      this.router.navigate(['/login']);
    }

    // Pantau perubahan URL untuk mengetahui apakah berada di halaman login
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isLoginPage = event.url === '/login' || event.url === '/';
        console.log('URL berubah:', event.url);
        console.log('isLoginPage:', this.isLoginPage);
        console.log('isLoggedIn:', this.isLoggedIn);
      }
    });
  }

  isAdmin(): boolean {
    return this.authService.getRole() === 'admin'; // ✅ Pastikan `getUserRole()` ada di `AuthService`
  }


  isPetugas(): boolean {
    return this.role === 'petugas';
  }

  checkLoginStatus(): void {
    this.isLoggedIn = !!this.authService.getToken();
    this.role = this.authService.getRole();
    this.username = this.authService.getUsername();
    console.log('🔍 Status login:', { isLoggedIn: this.isLoggedIn, role: this.role, username: this.username });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
