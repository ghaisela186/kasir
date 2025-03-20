import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = this.authService.getToken();
    const userRole = this.authService.getRole();
    const allowedRoles = route.data['roles'] as string[];

    console.log('🔐 AuthGuard - role:', userRole, 'allowed:', allowedRoles);

    if (!token || !userRole) {
      console.warn('🚨 Tidak ada token/role, redirect ke login!');
      this.router.navigate(['/login']);
      return false;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      console.warn('🚨 Role tidak diizinkan!');

      // Redirect ke halaman sesuai role
      if (userRole === 'admin') {
        this.router.navigate(['/home']);
      } else if (userRole === 'petugas') {
        this.router.navigate(['/transaksi']);
      } else {
        this.router.navigate(['/login']);
      }

      return false;
    }

    return true;
  }
}
