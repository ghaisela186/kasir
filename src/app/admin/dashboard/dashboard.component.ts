import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';

import { ChartOptions, ChartType, ChartDataset } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  totalPenjualan = 0;
  jumlahMember = 0;
  totalProduk = 0;
  totalPendapatan = 0;
  selectedMode: string = 'bulanan';

  transaksiTerbaru: any[] = [];
  stokMenipis: any[] = []; // ✅ Notifikasi stok minimum

  chartData: ChartDataset<'line'>[] = [
    {
      data: [],
      label: 'Penjualan',
      fill: true,
      tension: 0.3,
      borderColor: 'rgba(54, 162, 235, 1)',
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      pointBackgroundColor: 'rgba(54, 162, 235, 1)'
    }
  ];

  chartLabels: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

  chartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  chartType: ChartType = 'line';

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.getDataDashboard();
    this.getStokMenipis();
  }

  onModeChange(): void {
    this.getDataDashboard();
  }
  
  getDataDashboard(): void {
    this.dashboardService.getDashboardData(this.selectedMode).subscribe({
      next: (res: any) => {
        this.totalPenjualan = res.totalPenjualan;
        this.jumlahMember = res.jumlahMember;
        this.totalProduk = res.totalProduk;
        this.totalPendapatan = res.totalPendapatan;
        this.transaksiTerbaru = res.transaksiTerbaru;
  
        this.chartData = [
          {
            data: res.chartData,
            label: this.selectedMode === 'bulanan' ? 'Penjualan Bulanan' : 'Penjualan Tahunan',
            fill: true,
            tension: 0.3,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            pointBackgroundColor: 'rgba(54, 162, 235, 1)'
          }
        ];
  
        this.chartLabels = res.chartLabels; // label fleksibel per bulan/per tahun
      },
      error: (err) => {
        console.error('❌ Gagal ambil data dashboard:', err);
      }
    });
  }

  getStokMenipis(): void {
    this.dashboardService.getStokMenipis().subscribe({
      next: (res: any) => {
        this.stokMenipis = res.data;
        if (this.stokMenipis.length > 0) {
          console.warn('⚠️ Ada stok menipis:', this.stokMenipis);
        }
      },
      error: (err) => {
        console.error('❌ Gagal ambil data stok menipis:', err);
      }
    });
  }
}
