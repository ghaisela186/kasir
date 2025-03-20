const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (db) => {
  return {
    login: async (req, res) => {
      try {
        const { email, password } = req.body;

        if (!email || !password) {
          return res.status(400).json({ message: 'Email dan password harus diisi' });
        }

        // Ambil user by email ➜ Hanya field yang dibutuhkan
        const [users] = await db.query(
          'SELECT id_user, username, email, password, role FROM users WHERE email = ?',
          [email]
        );

        if (users.length === 0) {
          return res.status(401).json({ message: 'Email tidak ditemukan' });
        }

        const userData = users[0];

        console.log('✅ Data user ditemukan:', userData);

        if (!userData.password) {
          return res.status(500).json({ message: 'Password tidak ditemukan di database!' });
        }

        // Cek password
        const isMatch = await bcrypt.compare(password, userData.password);
        if (!isMatch) {
          return res.status(401).json({ message: 'Password salah' });
        }

        // Buat token JWT ➜ Pastikan id_user ada
        const tokenPayload = {
          id_user: userData.id_user,
          email: userData.email,
          role: userData.role
        };

        console.log("🔐 JWT Payload:", tokenPayload);

        const token = jwt.sign(
          tokenPayload,
          process.env.JWT_SECRET_KEY || 'default-secret-key',
          { expiresIn: '1h' }
        );

        console.log("✅ Login berhasil! Token dibuat.");

        res.json({
          token,
          role: userData.role,
          username: userData.username
        });

      } catch (error) {
        console.error('❌ Kesalahan server di login:', error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
      }
    }
  };
};
