// routes/users.js
const express = require('express');
const bcrypt = require('bcrypt');
const { authenticate, authorize } = require('../middleware/auth');

module.exports = (db) => {
  if (!db) {
    throw new Error('Database connection not provided');
  }

  const router = express.Router();

  // Mendapatkan semua user
  router.get('/', authenticate, async (req, res) => {
    try {
      const [results] = await db.query('SELECT * FROM users');
      res.json(results);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Mendapatkan user berdasarkan ID
  router.get('/:id', authenticate, authorize(['admin']), async (req, res) => {
    try {
      const { id } = req.params;
      const [results] = await db.query(
        'SELECT id_user, nama_user, email, username, role, alamat, hp, status, created_at, updated_at FROM users WHERE id_user = ?',
        [id]
      );
      if (results.length === 0) return res.status(404).json({ message: 'User tidak ditemukan' });
      res.json(results[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Menambahkan user baru
  router.post('/', authenticate, authorize(['admin']), async (req, res) => {
    try {
      const { nama_user, email, username, password, role, alamat, hp, status } = req.body;
      if (!nama_user || !email || !username || !password || !role) {
        return res.status(400).json({ error: 'Semua field wajib diisi!' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const [results] = await db.query(
        `INSERT INTO users (nama_user, email, username, password, role, alamat, hp, status, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [nama_user, email, username, hashedPassword, role, alamat, hp, status]
      );
      res.status(201).json({ success: true, message: 'User berhasil ditambahkan!', userId: results.insertId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Memperbarui user
  router.put('/:id', authenticate, async (req, res) => {
    try {
      const { id } = req.params;
      const { nama_user, email, username, password, role, alamat, hp, status } = req.body;
      const values = [nama_user, email, username, role, alamat, hp, status, id];
      let query = `UPDATE users SET nama_user = ?, email = ?, username = ?, role = ?, alamat = ?, hp = ?, status = ?, updated_at = NOW() WHERE id_user = ?`;
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        query = `UPDATE users SET nama_user = ?, email = ?, username = ?, password = ?, role = ?, alamat = ?, hp = ?, status = ?, updated_at = NOW() WHERE id_user = ?`;
        values.splice(3, 0, hashedPassword);
      }
      const [results] = await db.query(query, values);
      if (results.affectedRows === 0) return res.status(404).json({ message: 'User tidak ditemukan' });
      res.json({ success: true, message: 'User berhasil diperbarui' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Menghapus user
  router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
    try {
      const { id } = req.params;
      const [results] = await db.query('DELETE FROM users WHERE id_user = ?', [id]);
      if (results.affectedRows === 0) return res.status(404).json({ message: 'User tidak ditemukan' });
      res.json({ success: true, message: 'User berhasil dihapus' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
