import { Component, OnInit } from '@angular/core';
import { KategoriService } from '../../services/kategori.service';

@Component({
  selector: 'app-kategori',
  templateUrl: './kategori.component.html',
  styleUrls: ['./kategori.component.css'],
})
export class KategoriComponent implements OnInit {
  kategoriList: any[] = [];
  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  modalTitle: string = 'Tambah Kategori';
  formData: any = { id_kategori: '', nama_kategori: '' };

  constructor(private kategoriService: KategoriService) {}

  ngOnInit(): void {
    this.getAll();
  }

  getAll(): void {
    this.kategoriService.getAll().subscribe(
      (data) => {
        console.log('✅ Data kategori berhasil diambil:', data);
        this.kategoriList = data;
      },
      (error) => {
        console.error('🚨 Error fetching kategori:', error);
        alert('Gagal mengambil data kategori, cek koneksi dan otorisasi!');
      }
    );
  }

  openTambahModal(): void {
    this.isModalOpen = true;
    this.isEditMode = false;
    this.modalTitle = 'Tambah Kategori';
    this.formData = { id_kategori: '', nama_kategori: '' };
  }

  openEditModal(kategori: any): void {
    this.isModalOpen = true;
    this.isEditMode = true;
    this.modalTitle = 'Edit Kategori';
    this.formData = { ...kategori };
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  onSubmit(): void {
    console.log('📤 Data sebelum dikirim:', this.formData);

    if (!this.formData.id_kategori || !this.formData.nama_kategori) {
      alert('ID Kategori dan Nama Kategori wajib diisi!');
      return;
    }

    if (this.isEditMode) {
      // EDIT kategori (gunakan PUT)
      this.kategoriService.editKategori(this.formData.id_kategori, this.formData)
        .subscribe(
          () => {
            alert('Kategori berhasil diperbarui!');
            this.getAll();
            this.closeModal();
          },
          (error) => {
            console.error('❌ Error updating kategori:', error);
            alert('Gagal memperbarui kategori');
          }
        );
    } else {
      // TAMBAH kategori baru (gunakan POST)
      this.kategoriService.tambahKategori(this.formData).subscribe(
        () => {
          alert('Kategori berhasil ditambahkan!');
          this.getAll();
          this.closeModal();
        },
        (error) => {
          console.error('❌ Error adding kategori:', error);
          alert('Gagal menambahkan kategori');
        }
      );
    }
  }

  hapusKategori(id: string): void {
    if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      this.kategoriService.hapusKategori(id).subscribe({
        next: () => {
          alert('Kategori berhasil dihapus!');
          this.getAll(); // refresh daftar kategori
        },
        error: (error) => {
          console.error('Error deleting kategori:', error);
          alert('Gagal menghapus kategori.');
        }
      });
    }
  }  

}
