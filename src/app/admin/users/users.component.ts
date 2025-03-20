import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  usersList: any[] = [];
  isModalOpen = false;
  isEditMode = false;
  modalTitle = 'Tambah User';
  formData: any = { role: 'petugas', status: 'aktif' };

  constructor(private UsersService: UsersService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.UsersService.getUsers().subscribe((data) => {
      this.usersList = data; // Jika API langsung mengembalikan array
    });
  }
  
  openTambahModal(): void {
    this.isModalOpen = true;
    this.isEditMode = false;
    this.modalTitle = 'Tambah User';
    this.formData = { role: 'petugas', status: 'aktif' };
  }

  openEditModal(user: any): void {
    this.isModalOpen = true;
    this.isEditMode = true;
    this.modalTitle = 'Edit User';
    this.formData = { ...user };
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  onSubmit(): void {
    if (this.isEditMode) {
      this.UsersService.updateUser(this.formData).subscribe((response) => {
        alert(response.message);
        this.getUsers();
        this.closeModal();
      });
    } else {
      this.UsersService.addUser(this.formData).subscribe((response) => {
        alert(response.message);
        this.getUsers();
        this.closeModal();
      });
    }
  }

  hapusUser(id: number): void {
    if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      this.UsersService.deleteUser(id).subscribe((response) => {
        alert(response.message);
        this.getUsers();
      });
    }
  }
}
