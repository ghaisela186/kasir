const jwt = require('jsonwebtoken');

// ✅ Middleware untuk verifikasi token JWT
const authenticate = (req, res, next) => {
  console.debug("✅ Middleware authenticate dijalankan...");

  // Ambil token dari header Authorization
  const authHeader = req.headers.authorization;
  console.debug("🔍 Authorization Header:", authHeader || "Tidak ada");

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn("🚨 Token tidak ditemukan atau format salah!");
    return res.status(401).json({ message: 'Token tidak ditemukan atau format salah' });
  }

  // Ambil token setelah "Bearer "
  const token = authHeader.split(' ')[1];
  console.debug("🔑 Extracted Token:", token);

  try {
    // Pastikan secret key tersedia
    const secretKey = process.env.JWT_SECRET_KEY || 'default-secret-key';
    if (!secretKey) {
      console.error("🚨 JWT_SECRET_KEY tidak ditemukan di environment variables!");
      return res.status(500).json({ message: 'Server error: konfigurasi JWT tidak ditemukan' });
    }

    // Verifikasi token
    const decoded = jwt.verify(token, secretKey);
    console.info("✅ Token berhasil diverifikasi:", decoded);

    if (!decoded.id_user) {
      console.warn("🚨 ID user tidak ditemukan dalam token!");
      return res.status(403).json({ message: 'Token tidak valid, user tidak ditemukan' });
    }

    // Inject decoded data ke req.user ➜ Buat akses endpoint lain
    req.user = {
      id_user: decoded.id_user,
      email: decoded.email,
      role: decoded.role
    };

    console.debug("🔐 User dalam request:", req.user);

    next(); // Lanjut ke handler berikutnya

  } catch (err) {
    console.error("🚨 JWT Verification Error:", err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(403).json({ message: 'Token sudah expired, silakan login kembali' });
    }

    return res.status(403).json({ message: 'Token tidak valid' });
  }
};

// ✅ Middleware authorize ➜ Untuk validasi role user
const authorize = (roles) => (req, res, next) => {
  console.debug("🔍 Checking user role:", req.user ? req.user.role : "Tidak ada user");

  if (!req.user) {
    return res.status(401).json({ message: 'Token tidak ditemukan atau belum diautentikasi' });
  }

  if (!roles.includes(req.user.role)) {
    console.warn(`🚨 Akses ditolak! Role '${req.user.role}' tidak diizinkan.`);
    return res.status(403).json({ message: 'Akses ditolak, role tidak sesuai' });
  }

  next(); // Role cocok ➜ lanjut
};

module.exports = { authenticate, authorize };
