const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');

module.exports = (db) => {
  // Mendapatkan semua data pelanggan (hanya untuk petugas)
  router.get('/', authenticate, authorize(['petugas']), async (req, res) => {
    try {
      const [results] = await db.query('SELECT * FROM pelanggan');
      res.json(results);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Mendapatkan data pelanggan berdasarkan ID
  router.get('/:id', authenticate, authorize(['petugas']), async (req, res) => {
    try {
      const { id } = req.params;
      const [results] = await db.query('SELECT * FROM pelanggan WHERE id_pelanggan = ?', [id]);

      if (results.length === 0) {
        return res.status(404).json({ message: 'Pelanggan tidak ditemukan' });
      }

      res.json(results[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Menambahkan pelanggan baru
  router.post('/', authenticate, authorize(['petugas']), async (req, res) => {
    try {
      const { nama_pelanggan, alamat, hp } = req.body;
  
      if (!nama_pelanggan || !alamat || !hp) {
        return res.status(400).json({ error: 'Semua field wajib diisi!' });
      }
  
      const query = 'INSERT INTO pelanggan (nama_pelanggan, alamat, hp) VALUES (?, ?, ?)';
      const [results] = await db.query(query, [nama_pelanggan, alamat, hp]);
  
      res.status(201).json({
        success: true,
        message: 'Pelanggan berhasil ditambahkan!',
        pelangganId: results.insertId
      });
    } catch (err) {
      console.error('❌ Error:', err);
      res.status(500).json({ error: 'Gagal menambah pelanggan.' });
    }
  });
  
  // Memperbarui data pelanggan berdasarkan ID
  router.put('/:id', authenticate, authorize(['petugas']), async (req, res) => {
    try {
      const { id } = req.params;
      const { nama_pelanggan, alamat, hp } = req.body;
  
      if (!nama_pelanggan || !alamat || !hp) {
        return res.status(400).json({ error: 'Semua field wajib diisi!' });
      }
  
      const query = 'UPDATE pelanggan SET nama_pelanggan = ?, alamat = ?, hp = ? WHERE id_pelanggan = ?';
      const [results] = await db.query(query, [nama_pelanggan, alamat, hp, id]);
  
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Pelanggan tidak ditemukan' });
      }
  
      res.json({
        success: true,
        message: 'Pelanggan berhasil diperbarui'
      });
    } catch (err) {
      console.error('❌ Error:', err);
      res.status(500).json({ error: 'Gagal memperbarui pelanggan.' });
    }
  });
  

  // Menghapus pelanggan berdasarkan ID
  router.delete('/:id', authenticate, authorize(['petugas']), async (req, res) => {
    try {
      const { id } = req.params;
      const [results] = await db.query('DELETE FROM pelanggan WHERE id_pelanggan = ?', [id]);

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Pelanggan tidak ditemukan' });
      }

      res.status(200).json({ success: true, message: 'Pelanggan berhasil dihapus' });
    } catch (err) {
      res.status(500).json({ error: 'Gagal menghapus pelanggan' });
    }
  });

  return router;
};
