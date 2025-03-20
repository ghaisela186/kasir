const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // 📌 Simpan transaksi ke `penjualan` & `detail_penjualan`
  router.post("/", async (req, res) => {
    try {
      const { id_user, id_pelanggan, diskon, total_harga, tanggal_penjualan, items } = req.body;

      if (!id_user || !id_pelanggan || !total_harga || !items.length) {
        return res.status(400).json({ message: "Data tidak lengkap!" });
      }

      // Simpan ke tabel `penjualan`
      const [result] = await db.execute(
        `INSERT INTO penjualan (id_user, id_pelanggan, diskon, total_harga, tanggal_penjualan) 
         VALUES (?, ?, ?, ?, NOW())`,
        [id_user, id_pelanggan, diskon, total_harga]
      );

      const id_penjualan = result.insertId;

      // Simpan ke tabel `detail_penjualan`
      for (const item of items) {
        await db.execute(
          `INSERT INTO detail_penjualan (id_penjualan, id_produk, harga_jual, qty, diskon_barang, sub_total) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [id_penjualan, item.id_produk, item.harga_jual, item.jumlah, item.diskon_barang, item.subtotal]
        );
        

        // Update stok produk
        await db.execute(
          `UPDATE produk SET stok = stok - ? WHERE id_produk = ?`,
          [item.jumlah, item.id_produk]
        );
      }

      res.status(201).json({ message: "Transaksi berhasil disimpan!", id_penjualan });
    } catch (error) {
      console.error("❌ Error saat menyimpan transaksi:", error);
      res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
  });

  // 📌 Ambil semua transaksi untuk laporan
  router.get("/", async (req, res) => {
    try {
      const [rows] = await db.execute(`
        SELECT p.id_penjualan, p.id_user, u.nama AS nama_user, p.id_pelanggan, pl.nama_pelanggan, 
               p.diskon, p.total_harga, p.tanggal_penjualan 
        FROM penjualan p
        JOIN users u ON p.id_user = u.id_user
        JOIN pelanggan pl ON p.id_pelanggan = pl.id_pelanggan
        ORDER BY p.tanggal_penjualan DESC
      `);
      res.json(rows);
    } catch (error) {
      console.error("❌ Error saat mengambil data transaksi:", error);
      res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
  });

  // 📌 Ambil detail transaksi berdasarkan `id_penjualan`
  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      // Ambil data transaksi utama
      const [penjualan] = await db.execute(
        `SELECT p.*, u.nama AS nama_user, pl.nama_pelanggan 
         FROM penjualan p
         JOIN users u ON p.id_user = u.id_user
         JOIN pelanggan pl ON p.id_pelanggan = pl.id_pelanggan
         WHERE p.id_penjualan = ?`,
        [id]
      );

      if (penjualan.length === 0) {
        return res.status(404).json({ message: "Transaksi tidak ditemukan" });
      }

      // Ambil detail barang dalam transaksi
      const [detail] = await db.execute(
        `SELECT dp.*, pr.nama_produk 
         FROM detail_penjualan dp
         JOIN produk pr ON dp.id_produk = pr.id_produk
         WHERE dp.id_penjualan = ?`,
        [id]
      );

      res.json({ transaksi: penjualan[0], detail_barang: detail });
    } catch (error) {
      console.error("❌ Error saat mengambil detail transaksi:", error);
      res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
  });

  return router;
};
