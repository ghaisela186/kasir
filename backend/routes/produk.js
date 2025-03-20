const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');

module.exports = (db) => {
  // Mendapatkan semua produk
  router.get('/', authenticate, authorize(['admin']), async (req, res) => {
    try {
      const [results] = await db.query(`
        SELECT p.*, k.nama_kategori 
        FROM produk p 
        JOIN kategori k ON p.id_kategori = k.id_kategori
      `);
      res.json(results);
    } catch (error) {
      console.error('Error fetching produk:', error);
      res.status(500).json({ error: 'Gagal mengambil data produk' });
    }
  });

  // Mendapatkan produk berdasarkan ID
  router.get('/:id', authenticate, authorize(['admin']), async (req, res) => {
    try {
      const { id } = req.params;
      const [results] = await db.query(`
        SELECT p.*, k.nama_kategori 
        FROM produk p 
        JOIN kategori k ON p.id_kategori = k.id_kategori
        WHERE id_produk = ?
      `, [id]);

      if (results.length === 0) {
        return res.status(404).json({ message: 'Produk tidak ditemukan' });
      }
      res.json(results[0]);
    } catch (error) {
      console.error('Error fetching produk by ID:', error);
      res.status(500).json({ error: 'Gagal mengambil data produk' });
    }
  });

  // Menambahkan produk baru
  router.post('/', authenticate, authorize(['admin']), async (req, res) => {
    try {
      const { id_kategori, nama_produk, harga_beli, harga_jual, stok, barcode, diskon_barang } = req.body;
  
      if (!id_kategori || !nama_produk || !harga_beli || !harga_jual || !stok) {
        return res.status(400).json({ error: 'Semua data wajib diisi' });
      }
  
      const [kategoriCheck] = await db.query('SELECT id_kategori FROM kategori WHERE id_kategori = ?', [id_kategori]);
      if (kategoriCheck.length === 0) {
        return res.status(404).json({ error: 'Kategori tidak ditemukan' });
      }
  
      const sql = `
        INSERT INTO produk (id_kategori, nama_produk, harga_beli, harga_jual, stok, barcode, diskon_barang, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
  
      const [result] = await db.query(sql, [
        id_kategori, nama_produk, harga_beli, harga_jual, stok, barcode, diskon_barang || 0
      ]);
  
      res.status(201).json({ message: 'Produk berhasil ditambahkan', id: result.insertId });
    } catch (error) {
      console.error('Error adding produk:', error);
      res.status(500).json({ error: 'Gagal menambahkan produk' });
    }
  });
  

  // Mengupdate produk
  router.put('/:id', authenticate, authorize(['admin']), async (req, res) => {
    try {
      const { id_kategori, nama_produk, harga_beli, harga_jual, stok, barcode, diskon_barang } = req.body;
      const { id } = req.params;
  
      const query = `
        UPDATE produk 
        SET id_kategori = ?, nama_produk = ?, harga_beli = ?, harga_jual = ?, stok = ?, barcode = ?, diskon_barang = ?, updated_at = NOW() 
        WHERE id_produk = ?`;
  
      const [result] = await db.query(query, [
        id_kategori, nama_produk, harga_beli, harga_jual, stok, barcode, diskon_barang || 0, id
      ]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Produk tidak ditemukan' });
      }
  
      res.json({ message: 'Produk berhasil diperbarui' });
    } catch (error) {
      console.error('Error updating produk:', error);
      res.status(500).json({ error: 'Gagal mengupdate produk' });
    }
  });
  

  // Menghapus produk
  router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
    try {
      const { id } = req.params;

      const [results] = await db.query('SELECT * FROM produk WHERE id_produk = ?', [id]);
      if (results.length === 0) {
        return res.status(404).json({ message: 'Produk tidak ditemukan' });
      }

      await db.query('DELETE FROM produk WHERE id_produk = ?', [id]);
      res.status(200).json({ message: 'Produk berhasil dihapus' });
    } catch (error) {
      console.error('Error deleting produk:', error);
      res.status(500).json({ error: 'Gagal menghapus produk' });
    }
  });

  // Ambil semua kategori buat dropdown
router.get('/kategori/all', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const [kategori] = await db.query('SELECT * FROM kategori');
    res.json(kategori);
  } catch (error) {
    console.error('Error fetching kategori:', error);
    res.status(500).json({ error: 'Gagal mengambil data kategori' });
  }
});


  return router;
};
