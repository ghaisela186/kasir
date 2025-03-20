import { Component, OnInit } from '@angular/core';
import { TransaksiService } from '../../services/transaksi.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-transaksi',
  templateUrl: './transaksi.component.html',
  styleUrls: ['./transaksi.component.css']
})
export class TransaksiComponent implements OnInit {

  kodeBarang: string = '';
  daftarBarang: any[] = [];
  totalHarga: number = 0;
  diskonMember: number = 0;
  uangDiberikan: number = 0;
  kembalian: number = 0;

  pelangganList: any[] = [];
  filteredPelanggan: any[] = [];
  selectedPelanggan: any = null;
  inputPelanggan: string = '';

  isNotaOpen: boolean = false;
  notaData: any = null;
  namaKasir: string = '';

  constructor(
    private transaksiService: TransaksiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getPelanggan();
    this.namaKasir = this.authService.getUsername();
  }

  getPelanggan() {
    this.transaksiService.getPelanggan().subscribe((data) => {
      this.pelangganList = data;
      this.filteredPelanggan = data;
    });
  }

  filterPelanggan() {
    const query = this.inputPelanggan.toLowerCase();
    this.filteredPelanggan = this.pelangganList.filter((p) =>
      p.nama_pelanggan.toLowerCase().includes(query)
    );
  }

  pilihPelanggan(pelanggan: any) {
    this.selectedPelanggan = pelanggan;
    this.inputPelanggan = pelanggan.nama_pelanggan;
    this.filteredPelanggan = [];

    this.diskonMember = 5; // contoh diskon member default
    this.hitungTotal();
  }

  resetPelanggan() {
    this.selectedPelanggan = null;
    this.inputPelanggan = '';
    this.filteredPelanggan = this.pelangganList;
    this.diskonMember = 0;
    this.hitungTotal();
  }

  cariBarang() {
    if (!this.kodeBarang.trim()) return alert('Masukkan kode barang!');

    this.transaksiService.getBarangByKode(this.kodeBarang).subscribe((barang) => {
      if (!barang) return alert('Barang tidak ditemukan');

      let item = this.daftarBarang.find((b) => b.id_produk === barang.id_produk);
      if (item) {
        if (item.jumlah < item.stok) {
          item.jumlah++;
          item.subtotal = this.hitungSubtotal(item);
        } else {
          alert('Stok tidak mencukupi');
        }
      } else {
        barang.jumlah = 1;
        barang.diskon_barang = barang.diskon_barang || 0;
        barang.subtotal = this.hitungSubtotal(barang);
        this.daftarBarang.push(barang);
      }

      this.hitungTotal();
    });

    this.kodeBarang = '';
  }

  tambahJumlah(index: number) {
    const item = this.daftarBarang[index];
    if (item.jumlah < item.stok) {
      item.jumlah++;
      item.subtotal = this.hitungSubtotal(item);
      this.hitungTotal();
    }
  }

  kurangiJumlah(index: number) {
    const item = this.daftarBarang[index];
    if (item.jumlah > 1) {
      item.jumlah--;
      item.subtotal = this.hitungSubtotal(item);
      this.hitungTotal();
    }
  }

  hapusBarang(index: number) {
    this.daftarBarang.splice(index, 1);
    this.hitungTotal();
  }

  hitungSubtotal(item: any) {
    const diskonPersen = item.diskon_barang || 0;
    const diskonNominal = (diskonPersen / 100) * item.harga_jual;
  
    item.diskon_nominal = Math.round(diskonNominal); // simpan diskon rupiah per item
  
    const hargaDiskon = item.harga_jual - item.diskon_nominal;
    const subtotal = hargaDiskon * item.jumlah;
  
    return Math.round(subtotal); // subtotal setelah diskon
  }
  

  hitungTotal() {
    const totalSebelumDiskonMember = this.daftarBarang.reduce(
      (total, item) => total + item.subtotal,
      0
    );

    let diskonMemberHitung = 0;
    if (this.selectedPelanggan) {
      diskonMemberHitung = Math.min(Math.floor(totalSebelumDiskonMember / 100000) * 10, 30);
      if (totalSebelumDiskonMember >= 50000 && diskonMemberHitung < 5) {
        diskonMemberHitung = 5;
      }
    }

    this.diskonMember = diskonMemberHitung;

    const diskonMemberRupiah = (this.diskonMember / 100) * totalSebelumDiskonMember;
    this.totalHarga = Math.round(totalSebelumDiskonMember - diskonMemberRupiah);

    this.kembalian = this.uangDiberikan > this.totalHarga
      ? this.uangDiberikan - this.totalHarga
      : 0;
  }

  prosesTransaksi() {
    if (this.daftarBarang.length === 0) return alert('Belum ada barang');
    if (this.uangDiberikan < this.totalHarga) return alert('Uang kurang');

    const transaksiData = {
      id_user: this.authService.getUserId(),
      id_pelanggan: this.selectedPelanggan ? this.selectedPelanggan.id_pelanggan : null,
      diskon: this.diskonMember,
      total_harga: this.totalHarga,
      tanggal_penjualan: new Date().toISOString().slice(0, 19).replace('T', ' '),
      items: this.daftarBarang.map(item => ({
        id_produk: item.id_produk,
        jumlah: item.jumlah,
        harga_jual: item.harga_jual,
        diskon_barang: item.diskon_barang || 0,
        diskon_nominal: item.diskon_nominal || 0,
        subtotal: item.subtotal
      }))
    };

    this.transaksiService.simpanTransaksi(transaksiData).subscribe(() => {
      this.notaData = {
        tanggal_penjualan: transaksiData.tanggal_penjualan,
        nama_user: this.namaKasir,
        nama_pelanggan: this.selectedPelanggan ? this.selectedPelanggan.nama_pelanggan : 'Umum',
        diskon: this.diskonMember,
        total_harga: this.totalHarga,
        uang_dibayar: this.uangDiberikan,
        kembalian: this.kembalian,
        items: [...this.daftarBarang]
      };
      this.isNotaOpen = true;
      this.resetForm();
    });
  }

  resetForm() {
    this.daftarBarang = [];
    this.totalHarga = 0;
    this.diskonMember = 0;
    this.uangDiberikan = 0;
    this.kembalian = 0;
    this.selectedPelanggan = null;
    this.inputPelanggan = '';
  }

  cetakNota() {
    window.print();
  }

  tutupNota() {
    this.isNotaOpen = false;
  }
}
