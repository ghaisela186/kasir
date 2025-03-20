import { Component, OnInit } from '@angular/core';
import { ProdukService } from '../../services/produk.service';
import { KategoriService } from '../../services/kategori.service';

@Component({
  selector: 'app-pendataan-barang',
  templateUrl: './pendataan-barang.component.html',
  styleUrls: ['./pendataan-barang.component.css']
})
export class PendataanBarangComponent implements OnInit {

  produkList: any[] = [];
  kategoriList: any[] = [];

  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  modalTitle: string = 'Tambah Produk';

  formData: any = {
    id_kategori: '',
    nama_produk: '',
    harga_beli: '',
    harga_jual: '',
    stok: '',
    barcode: '',
    diskon_barang: 0
  };

  constructor(
    private produkService: ProdukService,
    private kategoriService: KategoriService
  ) {}

  ngOnInit(): void {
    this.getProduk();
    this.getKategori();
  }

  getProduk(): void {
    this.produkService.getAll().subscribe({
      next: (data) => {
        this.produkList = data.map(produk => ({
          ...produk,
          created_at: produk.created_at ? new Date(produk.created_at) : null,
          updated_at: produk.updated_at ? new Date(produk.updated_at) : null
        }));
        console.log('✅ Produk berhasil dimuat:', this.produkList);
      },
      error: (error) => {
        console.error('❌ Gagal mengambil data produk:', error);
        alert('Gagal mengambil data produk.');
      }
    });
  }

  getKategori(): void {
    this.kategoriService.getAll().subscribe({
      next: (data) => {
        this.kategoriList = data;
        console.log('✅ Kategori berhasil dimuat:', this.kategoriList);
      },
      error: (error) => {
        console.error('❌ Gagal mengambil data kategori:', error);
        alert('Gagal mengambil data kategori.');
      }
    });
  }

  tambahProduk(): void {
    this.isModalOpen = true;
    this.isEditMode = false;
    this.modalTitle = 'Tambah Produk';
    this.formData = {
      id_kategori: '',
      nama_produk: '',
      harga_beli: '',
      harga_jual: '',
      stok: '',
      barcode: '',
      diskon_barang: 0
    };
  }

  openEditModal(produk: any): void {
    this.isModalOpen = true;
    this.isEditMode = true;
    this.modalTitle = 'Edit Produk';

    this.formData = {
      id_produk: produk?.id_produk || null,
      id_kategori: produk?.id_kategori || '',
      nama_produk: produk?.nama_produk || '',
      harga_beli: produk?.harga_beli || 0,
      harga_jual: produk?.harga_jual || 0,
      stok: produk?.stok || 0,
      barcode: produk?.barcode || '',
      diskon_barang: produk?.diskon_barang || 0,
      created_at: produk?.created_at || null,
      updated_at: new Date().toISOString()
    };
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  onSubmit(): void {
    if (!this.formData.id_kategori || !this.formData.nama_produk || !this.formData.harga_beli || !this.formData.harga_jual || !this.formData.stok) {
      alert('Semua data wajib diisi!');
      return;
    }

    const data = {
      id_kategori: this.formData.id_kategori,
      nama_produk: this.formData.nama_produk,
      harga_beli: this.formData.harga_beli,
      harga_jual: this.formData.harga_jual,
      stok: this.formData.stok,
      barcode: this.formData.barcode,
      diskon_barang: this.formData.diskon_barang
    };

    if (this.isEditMode) {
      this.produkService.update(this.formData.id_produk, data).subscribe({
        next: () => {
          alert('Produk berhasil diperbarui!');
          this.closeModal();
          this.getProduk();
        },
        error: (error) => {
          console.error('❌ Gagal memperbarui produk:', error);
          alert('Gagal memperbarui produk.');
        }
      });
    } else {
      this.produkService.create(data).subscribe({
        next: () => {
          alert('Produk berhasil ditambahkan!');
          this.closeModal();
          this.getProduk();
        },
        error: (error) => {
          console.error('❌ Gagal menambahkan produk:', error);
          alert('Gagal menambahkan produk.');
        }
      });
    }
  }

  hapusProduk(id: number): void {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      this.produkService.delete(id).subscribe({
        next: () => {
          alert('Produk berhasil dihapus!');
          this.getProduk();
        },
        error: (error) => {
          console.error('❌ Gagal menghapus produk:', error);
          alert('Gagal menghapus produk.');
        }
      });
    }
  }
}
