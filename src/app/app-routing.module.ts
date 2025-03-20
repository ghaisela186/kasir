import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { PendataanBarangComponent } from './admin/pendataan-barang/pendataan-barang.component';
import { PelangganComponent } from './petugas/pelanggan/pelanggan.component';
import { LaporanComponent } from './petugas/laporan/laporan.component';
import { DetailLaporanComponent } from './petugas/detail-laporan/detail-laporan.component';
import { UsersComponent } from './admin/users/users.component';
import { KategoriComponent } from './admin/kategori/kategori.component';
import { TransaksiComponent } from './petugas/transaksi/transaksi.component';

import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  // ✅ ADMIN ROUTES
  {
    path: 'home',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] },
  },
  {
    path: 'barang',
    component: PendataanBarangComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] },
  },
  {
    path: 'kategori',
    component: KategoriComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] },
  },
  {
    path: 'user',
    component: UsersComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] },
  },

  // ✅ PETUGAS ROUTES
  {
    path: 'pelanggan',
    component: PelangganComponent,
    canActivate: [AuthGuard],
    data: { roles: ['petugas'] },
  },
  {
    path: 'transaksi',
    component: TransaksiComponent,
    canActivate: [AuthGuard],
    data: { roles: ['petugas'] },
  },

  // ✅ COMMON ROUTES (admin & petugas)
  {
    path: 'laporan',
    component: LaporanComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'petugas'] },
  },
  {
    path: 'laporan/detail/:id_penjualan',
    component: DetailLaporanComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'petugas'] },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
