const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');

module.exports = (db) => {

  /**
   * ✅ Ambil daftar pelanggan untuk dropdown
   */
  router.get('/pelanggan', authenticate, authorize(['admin', 'petugas']), async (req, res) => {
    try {
      console.log("📢 Mengambil daftar pelanggan...");
  
      const [rows] = await db.query('SELECT id_pelanggan, nama_pelanggan FROM pelanggan');
      console.log("📋 Data pelanggan ditemukan:", rows);
  
      res.json(rows);
    } catch (error) {
      console.error('❌ ERROR DETAIL:', error);
      res.status(500).json({ message: error.message || 'Terjadi kesalahan server' });
    }
  });

  /**
   * ✅ Mencari barang berdasarkan barcode
   */
  router.get('/barang/:kode', authenticate, authorize(['admin', 'petugas']), async (req, res) => {
    try {
      const { kode } = req.params;
      console.log("📢 Menerima request barang dengan kode:", kode);
      
      const [rows] = await db.query('SELECT * FROM produk WHERE barcode = ?', [kode]);
      console.log("📦 Hasil query barang:", rows);

      if (rows.length === 0) {
        console.warn("⚠️ Barang tidak ditemukan!");
        return res.status(404).json({ message: 'Barang tidak ditemukan' });
      }

      res.json(rows[0]); // Kirim data barang ke frontend
    } catch (error) {
      console.error('❌ Error fetching barang:', error);
      res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
  });

  /**
   * ✅ Menyimpan transaksi baru
   */
  router.post("/", authenticate, authorize(['admin', 'petugas']), async (req, res) => {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
  
      const id_user = req.user.id_user;
      const { id_pelanggan, diskon, total_harga, tanggal_penjualan, items } = req.body;
  
      if (!id_user || !total_harga || !items || !items.length) {
        await conn.rollback();
        return res.status(400).json({ message: "Data tidak lengkap!" });
      }
  
      const idPelangganToSave = id_pelanggan && id_pelanggan !== 0 ? id_pelanggan : null;
      const diskonToSave = idPelangganToSave ? diskon || 0 : 0;
  
      const [result] = await conn.execute(
        `INSERT INTO penjualan (id_user, id_pelanggan, diskon, total_harga, tanggal_penjualan)
         VALUES (?, ?, ?, ?, ?)`,
        [
          id_user,
          idPelangganToSave,
          diskonToSave,
          total_harga,
          new Date(tanggal_penjualan).toISOString().slice(0, 19).replace("T", " ")
        ]
      );
  
      const id_penjualan = result.insertId;
  
      // Simpan detail penjualan dengan diskon_barang
      for (const item of items) {
        const hargaDiskon = item.harga_jual - (item.harga_jual * item.diskon_barang / 100);
        const subTotal = hargaDiskon * item.jumlah;
  
        await conn.execute(
          `INSERT INTO detail_penjualan (id_penjualan, id_produk, harga_jual, qty, sub_total, diskon_barang)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [id_penjualan, item.id_produk, item.harga_jual, item.jumlah, subTotal, item.diskon_barang || 0]
        );
  
        await conn.execute(
          `UPDATE produk SET stok = stok - ? WHERE id_produk = ?`,
          [item.jumlah, item.id_produk]
        );
      }
  
      await conn.commit();
      res.status(201).json({ message: "Transaksi berhasil disimpan!", id_penjualan });
  
    } catch (error) {
      await conn.rollback();
      console.error("❌ Error saat menyimpan transaksi:", error);
      res.status(500).json({ message: "Terjadi kesalahan pada server." });
    } finally {
      conn.release();
    }
  });
  
    router.get("/laporan", authenticate, authorize(["admin", "petugas"]), async (req, res) => {
      try {
        console.log("📢 Mengambil laporan transaksi...");
  
        const { start_date, end_date } = req.query;
  
        let query = `
          SELECT p.id_penjualan, u.username AS nama_user, pl.nama_pelanggan, p.diskon, p.total_harga, p.tanggal_penjualan
          FROM penjualan p
          JOIN users u ON p.id_user = u.id_user
          LEFT JOIN pelanggan pl ON p.id_pelanggan = pl.id_pelanggan
        `;
  
        const queryParams = [];
  
        if (start_date && end_date) {
          query += ` WHERE DATE(p.tanggal_penjualan) BETWEEN ? AND ? `;
          queryParams.push(start_date, end_date);
        }
  
        query += ` ORDER BY p.tanggal_penjualan DESC `;
  
        const [rows] = await db.query(query, queryParams);
  
        console.log("📊 Laporan transaksi ditemukan:", rows);
  
        res.json(rows);
  
      } catch (error) {
        console.error("❌ Error mengambil laporan transaksi:", error);
        res.status(500).json({ message: "Terjadi kesalahan server." });
      }
    });
  

  return router;
};
