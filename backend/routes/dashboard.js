const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');

module.exports = (db) => {

  router.get('/', authenticate, authorize(['admin']), async (req, res) => {
    try {
      const mode = req.query.mode || 'bulanan'; // Default mode = bulanan
      console.log('📊 Mode grafik:', mode);

      // Statistik umum
      const [[{ totalPenjualan }]] = await db.query(`SELECT fn_total_penjualan() AS totalPenjualan`);
      const [[{ jumlahMember }]] = await db.query(`SELECT fn_jumlah_member() AS jumlahMember`);
      const [[{ totalProduk }]] = await db.query(`SELECT fn_total_produk() AS totalProduk`);
      const [[{ totalPendapatan }]] = await db.query(`SELECT fn_total_pendapatan() AS totalPendapatan`);

      // Transaksi terbaru
      const [transaksiTerbaru] = await db.query(`
        SELECT p.id_penjualan, pl.nama_pelanggan, p.total_harga, p.tanggal_penjualan
        FROM penjualan p
        LEFT JOIN pelanggan pl ON p.id_pelanggan = pl.id_pelanggan
        ORDER BY p.tanggal_penjualan DESC
        LIMIT 5
      `);

      let chartData = [];
      let chartLabels = [];

      if (mode === 'bulanan') {
        // 📅 Grafik per BULAN dalam 1 tahun
        const [penjualanPerBulan] = await db.query(`
          SELECT MONTH(tanggal_penjualan) AS bulan, SUM(total_harga) AS total
          FROM penjualan
          WHERE YEAR(tanggal_penjualan) = YEAR(CURDATE())
          GROUP BY bulan
          ORDER BY bulan ASC
        `);

        chartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        chartData = Array(12).fill(0);

        penjualanPerBulan.forEach(row => {
          chartData[row.bulan - 1] = row.total;
        });

      } else if (mode === 'tahunan') {
        // 📅 Grafik per TAHUN
        const [penjualanPerTahun] = await db.query(`
          SELECT YEAR(tanggal_penjualan) AS tahun, SUM(total_harga) AS total
          FROM penjualan
          GROUP BY tahun
          ORDER BY tahun ASC
        `);

        chartLabels = penjualanPerTahun.map(row => row.tahun.toString());
        chartData = penjualanPerTahun.map(row => row.total);
      }

      res.json({
        totalPenjualan,
        jumlahMember,
        totalProduk,
        totalPendapatan,
        transaksiTerbaru,
        chartLabels,
        chartData
      });

    } catch (error) {
      console.error('❌ Error dashboard:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  router.get('/stok-menipis', authenticate, async (req, res) => {
    try {
      // Panggil stored procedure stok menipis
      const [rows] = await db.query('CALL sp_stok_menipis()');
  
      // Hasil CALL biasanya nested array: [ [rows], metadata ]
      const dataStokMenipis = rows[0]; // Ambil data dari index 0
  
      res.json({
        status: 'success',
        message: 'Data stok menipis ditemukan!',
        data: dataStokMenipis
      });
    } catch (error) {
      console.error('❌ Error stok menipis:', error);
      res.status(500).json({ status: 'error', message: 'Server error!', error });
    }
  });
  

  return router;
};
