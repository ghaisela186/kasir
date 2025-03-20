const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");

module.exports = (db) => {
  // ✅ Ambil laporan transaksi
  router.get('/penjualan', async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT p.id_penjualan, u.nama_user, pl.nama_pelanggan, p.diskon, p.total_harga, p.tanggal_penjualan 
        FROM penjualan p
        JOIN users u ON p.id_user = u.id_user
        LEFT JOIN pelanggan pl ON p.id_pelanggan = pl.id_pelanggan
        ORDER BY p.tanggal_penjualan DESC
      `);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: "Gagal mengambil laporan" });
    }
  });

  // ✅ Ambil detail transaksi berdasarkan id_penjualan
  router.get('/detail/:id_penjualan', async (req, res) => {
    try {
      const { id_penjualan } = req.params;
  
      const [penjualan] = await db.query(`
        SELECT p.*, u.nama_user, pl.nama_pelanggan
        FROM penjualan p
        JOIN users u ON p.id_user = u.id_user
        LEFT JOIN pelanggan pl ON p.id_pelanggan = pl.id_pelanggan
        WHERE p.id_penjualan = ?
      `, [id_penjualan]);
  
      const [rows] = await db.query(`
        SELECT dp.id_detail_penjualan, pr.nama_produk, dp.harga_jual, dp.qty, dp.diskon_barang, dp.sub_total
        FROM detail_penjualan dp
        JOIN produk pr ON dp.id_produk = pr.id_produk
        WHERE dp.id_penjualan = ?
      `, [id_penjualan]);
  
      res.json({
        transaksi: penjualan[0],
        detail_barang: rows
      });
    } catch (error) {
      console.error('❌ Gagal ambil detail laporan:', error);
      res.status(500).json({ message: "Gagal mengambil detail laporan" });
    }
  });
  
  return router;
};
