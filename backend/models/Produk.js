module.exports = (db) => {
    return {
      // Get semua produk dengan kategori
      getAll: (callback) => {
        db.query(
          `SELECT produk.*, kategori.nama_kategori 
           FROM produk 
           INNER JOIN kategori ON produk.id_kategori = kategori.id_kategori`,
          callback
        );
      },
  
      // Get produk berdasarkan ID
      getById: (id, callback) => {
        db.query('SELECT * FROM produk WHERE id_produk = ?', [id], callback);
      },
  
      // Tambah produk
      create: (data, callback) => {
        const { id_kategori, nama_produk, harga_beli, harga_jual, stok, barcode } = data;
        db.query(
          `INSERT INTO produk (id_kategori, nama_produk, harga_beli, harga_jual, stok, barcode) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [id_kategori, nama_produk, harga_beli, harga_jual, stok, barcode],
          callback
        );
      },
  
      // Update produk
      update: (id, data, callback) => {
        const { id_kategori, nama_produk, harga_beli, harga_jual, stok, barcode } = data;
        db.query(
          `UPDATE produk SET id_kategori=?, nama_produk=?, harga_beli=?, harga_jual=?, stok=?, barcode=? 
           WHERE id_produk=?`,
          [id_kategori, nama_produk, harga_beli, harga_jual, stok, barcode, id],
          callback
        );
      },
  
      // Hapus produk
      delete: (id, callback) => {
        db.query('DELETE FROM produk WHERE id_produk = ?', [id], callback);
      },
    };
  };
  