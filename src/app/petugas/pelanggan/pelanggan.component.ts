import { Component, OnInit } from '@angular/core';
import { PelangganService } from '../../services/pelanggan.service';

@Component({
  selector: 'app-pelanggan',
  templateUrl: './pelanggan.component.html',
  styleUrls: ['./pelanggan.component.css']
})
export class PelangganComponent implements OnInit {
  pelangganList: any[] = [];
  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  modalTitle: string = 'Tambah Pelanggan';
  formData: any = { nama_pelanggan: '', alamat: '', hp: '' };

  constructor(private pelangganService: PelangganService) {}

  ngOnInit(): void {
    this.getPelanggan();
  }

  // Ambil data pelanggan dari backend
  getPelanggan(): void {
    this.pelangganService.getPelanggan().subscribe(
      (data) => {
        this.pelangganList = data;
      },
      (error) => {
        console.error('Error fetching pelanggan:', error);
      }
    );
  }

  // Buka modal untuk tambah pelanggan
  openTambahModal(): void {
    this.isModalOpen = true;
    this.isEditMode = false;
    this.modalTitle = 'Tambah Pelanggan';
    this.formData = { nama_pelanggan: '', alamat: '', hp: '' };
  }
  
  openEditModal(pelanggan: any): void {
    this.isModalOpen = true;
    this.isEditMode = true;
    this.modalTitle = 'Edit Pelanggan';
    this.formData = { ...pelanggan };
  }
  
  

  // Menutup modal
  closeModal(): void {
    this.isModalOpen = false;
  }

  // Kirim form untuk tambah/edit pelanggan
  onSubmit(): void {

    console.log('📤 Data dikirim ke backend:', this.formData);
    if (this.isEditMode) {
      // Update pelanggan
      this.pelangganService.updatePelanggan(this.formData.id_pelanggan, this.formData).subscribe(
        () => {
          alert('Pelanggan berhasil diperbarui!');
          this.getPelanggan();
          this.closeModal();
        },
        (error) => {
          console.error('Error updating pelanggan:', error);
        }
      );
    } else {
      // Tambah pelanggan
      this.pelangganService.addPelanggan(this.formData).subscribe(
        () => {
          alert('Pelanggan berhasil ditambahkan!');
          this.getPelanggan();
          this.closeModal();
        },
        (error) => {
          console.error('Error adding pelanggan:', error);
        }
      );
    }
  }

  // Hapus pelanggan
  hapusPelanggan(id: number): void {
    if (confirm('Apakah Anda yakin ingin menghapus pelanggan ini?')) {
      this.pelangganService.deletePelanggan(id).subscribe(
        () => {
          alert('Pelanggan berhasil dihapus!');
          this.getPelanggan();
        },
        (error) => {
          console.error('Error deleting pelanggan:', error);
        }
      );
    }
  }
}
