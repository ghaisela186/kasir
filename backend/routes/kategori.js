const express = require('express');
const router = express.Router();
const { authorize } = require('../middleware/auth'); // Hapus authenticate karena sudah di server.js

module.exports = (db) => {
  // Mendapatkan semua kategori (Admin & Petugas)
  router.get('/kategori', async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM kategori');
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
    }
  });
  
  // Menambahkan kategori (Hanya Admin)
  router.post('/kategori', async (req, res) => {
    try {
      const { id_kategori, nama_kategori } = req.body;
  
      if (!id_kategori || !nama_kategori) {
        return res.status(400).json({ message: 'ID Kategori dan Nama Kategori wajib diisi' });
      }
  
      await db.query('INSERT INTO kategori (id_kategori, nama_kategori) VALUES (?, ?)', [id_kategori, nama_kategori]);
      res.status(201).json({ message: 'Kategori berhasil ditambahkan' });
    } catch (error) {
      console.error('❌ Error saat menambah kategori:', error);
      res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
    }
  });
  

  // Memperbarui kategori (Hanya Admin)
 
  // PUT update kategori berdasarkan ID
  router.put('/kategori/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { nama_kategori } = req.body;

      if (!nama_kategori) {
        return res.status(400).json({ message: 'Nama kategori wajib diisi' });
      }

      const [result] = await db.query(
        'UPDATE kategori SET nama_kategori = ? WHERE id_kategori = ?',
        [nama_kategori, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Kategori tidak ditemukan' });
      }

      res.json({ message: 'Kategori berhasil diperbarui' });
    } catch (error) {
      res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
    }
  });
  
  

  // Menghapus kategori (Hanya Admin)
  router.delete('/kategori/:id_kategori', async (req, res) => {
    try {
      const { id_kategori } = req.params;
  
      // Pastikan kategori ada sebelum dihapus
      const [rows] = await db.query('SELECT * FROM kategori WHERE id_kategori = ?', [id_kategori]);
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Kategori tidak ditemukan' });
      }
  
      await db.query('DELETE FROM kategori WHERE id_kategori = ?', [id_kategori]);
      res.json({ message: 'Kategori berhasil dihapus' });
    } catch (error) {
      console.error('❌ Error saat menghapus kategori:', error);
      res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
    }
  });
  

  return router;
};
