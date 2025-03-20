import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module'; // Pastikan path ini benar
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { PendataanBarangComponent } from './admin/pendataan-barang/pendataan-barang.component';
import { PelangganComponent } from './petugas/pelanggan/pelanggan.component';
import { LaporanComponent } from './petugas/laporan/laporan.component';
import { UsersComponent } from './admin/users/users.component';
import { KategoriComponent } from './admin/kategori/kategori.component';

import { AuthService } from './services/auth.service';
import { TransaksiComponent } from './petugas/transaksi/transaksi.component';
import { DetailLaporanComponent } from './petugas/detail-laporan/detail-laporan.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    PendataanBarangComponent,
    PelangganComponent,
    LaporanComponent,
    UsersComponent,
    KategoriComponent,
    TransaksiComponent,
    DetailLaporanComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgChartsModule,
  ],
  providers: [AuthService], // Hapus provideClientHydration() karena tidak diperlukan
  bootstrap: [AppComponent],
})
export class AppModule {}
