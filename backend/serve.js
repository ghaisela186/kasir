require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Koneksi database
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'kasir',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Cek koneksi database
db.getConnection()
  .then(() => console.log('✅ Connected to MySQL database'))
  .catch((err) => console.error('❌ Database connection failed:', err));

// Import routes dengan benar
const pelangganRoutes = require('./routes/pelanggan')(db);
const kategoriRoutes = require('./routes/kategori')(db);
const produkRoutes = require('./routes/produk')(db);
const usersRoutes = require('./routes/users')(db);  // Pastikan pemanggilan benar
const authRoutes = require('./routes/auth')(db);
const transaksiRoutes = require("./routes/transaksi");
const penjualanRoutes = require("./routes/penjualan")(db);
const laporanRoutes = require("./routes/laporan");  
const dashboardRoute = require('./routes/dashboard')(db);
const { authenticate } = require('./middleware/auth');

// Gunakan routes dengan benar
app.use('/api/auth', authRoutes);
app.use('/api/pelanggan', authenticate, pelangganRoutes);
app.use('/api', authenticate, kategoriRoutes);
app.use('/api/produk', authenticate, produkRoutes);
app.use('/api/users', authenticate, usersRoutes);
app.use("/api/transaksi", transaksiRoutes(db));
app.use("/api/penjualan", penjualanRoutes); // Tambahkan authenticate!
app.use("/api/laporan", laporanRoutes(db));
app.use('/api/dashboard', dashboardRoute);



// // Pastikan tidak pakai (db) lagi

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
