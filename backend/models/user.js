const User = (db) => ({
    // Mendapatkan user berdasarkan email
    getUserByEmail: async (email) => {
      const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      return rows.length ? rows[0] : null;
    },

    // Membuat user baru
    createUser: async (email, password, role) => {
      const [result] = await db.query(
        'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
        [email, password, role]
      );
      return result.insertId;
    }
});

module.exports = User;
