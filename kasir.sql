-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Waktu pembuatan: 20 Mar 2025 pada 00.57
-- Versi server: 8.0.30
-- Versi PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kasir`
--

DELIMITER $$
--
-- Prosedur
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_stok_menipis` ()   BEGIN
    SELECT id_produk, nama_produk, stok
    FROM produk
    WHERE stok <= 5
    ORDER BY stok ASC;
END$$

--
-- Fungsi
--
CREATE DEFINER=`root`@`localhost` FUNCTION `fn_jumlah_member` () RETURNS INT DETERMINISTIC BEGIN
  DECLARE total INT;
  SELECT COUNT(*) INTO total FROM pelanggan;
  RETURN total;
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `fn_total_pendapatan` () RETURNS DECIMAL(15,2) DETERMINISTIC BEGIN
  DECLARE total DECIMAL(15,2);
  SELECT SUM(total_harga) INTO total FROM penjualan;
  RETURN total;
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `fn_total_penjualan` () RETURNS INT DETERMINISTIC BEGIN
  DECLARE total INT DEFAULT 0;

  SELECT COUNT(*) INTO total FROM penjualan;

  RETURN total;
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `fn_total_produk` () RETURNS INT DETERMINISTIC BEGIN
  DECLARE total INT;
  SELECT COUNT(*) INTO total FROM produk;
  RETURN total;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Struktur dari tabel `detail_penjualan`
--

CREATE TABLE `detail_penjualan` (
  `id_detail_penjualan` int UNSIGNED NOT NULL,
  `id_penjualan` int UNSIGNED NOT NULL,
  `id_produk` bigint UNSIGNED NOT NULL,
  `harga_jual` decimal(8,2) NOT NULL,
  `qty` int NOT NULL,
  `sub_total` decimal(8,2) NOT NULL,
  `diskon_barang` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `detail_penjualan`
--

INSERT INTO `detail_penjualan` (`id_detail_penjualan`, `id_penjualan`, `id_produk`, `harga_jual`, `qty`, `sub_total`, `diskon_barang`) VALUES
(2, 2, 1, 3000.00, 2, 6000.00, 0),
(3, 2, 2, 3000.00, 3, 9000.00, 0),
(9, 5, 15, 29000.00, 3, 87000.00, 0),
(11, 7, 13, 25000.00, 2, 50000.00, 0),
(12, 7, 14, 45000.00, 1, 45000.00, 0),
(16, 9, 12, 60000.00, 2, 120000.00, 0),
(17, 9, 13, 25000.00, 1, 25000.00, 0),
(18, 9, 14, 45000.00, 1, 45000.00, 0),
(19, 10, 1, 3000.00, 5, 15000.00, 0),
(20, 11, 13, 25000.00, 1, 25000.00, 0),
(21, 12, 2, 3000.00, 1, 3000.00, 0),
(22, 13, 12, 60000.00, 1, 60000.00, 0),
(24, 15, 14, 45000.00, 2, 90000.00, 0),
(25, 16, 12, 60000.00, 2, 96000.00, 20),
(26, 17, 12, 60000.00, 1, 48000.00, 20),
(27, 17, 14, 45000.00, 1, 33750.00, 25),
(28, 17, 13, 25000.00, 1, 23750.00, 5),
(31, 19, 17, 17000.00, 1, 17000.00, 0),
(32, 19, 15, 29000.00, 1, 26100.00, 10),
(34, 21, 15, 29000.00, 1, 26100.00, 10),
(35, 22, 13, 25000.00, 4, 95000.00, 5),
(36, 23, 15, 29000.00, 1, 26100.00, 10),
(37, 24, 14, 45000.00, 1, 33750.00, 25),
(38, 25, 14, 45000.00, 2, 67500.00, 25),
(39, 26, 13, 25000.00, 1, 23750.00, 5);

--
-- Trigger `detail_penjualan`
--
DELIMITER $$
CREATE TRIGGER `pengurangan_stok` AFTER INSERT ON `detail_penjualan` FOR EACH ROW BEGIN
  UPDATE produk
  SET stok = stok - NEW.qty
  WHERE id_produk = NEW.id_produk;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Struktur dari tabel `kategori`
--

CREATE TABLE `kategori` (
  `id_kategori` varchar(255) NOT NULL,
  `nama_kategori` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `kategori`
--

INSERT INTO `kategori` (`id_kategori`, `nama_kategori`) VALUES
('A001', 'handbody'),
('A002', 'Minuman'),
('A003', 'kosmetik'),
('A005', 'sampo'),
('A006', 'obat');

-- --------------------------------------------------------

--
-- Struktur dari tabel `pelanggan`
--

CREATE TABLE `pelanggan` (
  `id_pelanggan` int NOT NULL,
  `nama_pelanggan` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `alamat` text,
  `hp` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `pelanggan`
--

INSERT INTO `pelanggan` (`id_pelanggan`, `nama_pelanggan`, `alamat`, `hp`) VALUES
(1, 'Tashfia Eka Salma', 'santen', '222'),
(3, 'Fani Kurniawan', 'kara', '234'),
(4, 'Rivera Inanensya', 'kasihan', '33333'),
(5, 'mch', 'tmnan', '12334555567'),
(6, 'Ghaisela Hayu Palupi', 'Piyungan', '12334555567'),
(7, 'Claudia Maria Fransisca', 'Banguntapan', '0888777777888');

-- --------------------------------------------------------

--
-- Struktur dari tabel `penjualan`
--

CREATE TABLE `penjualan` (
  `id_penjualan` int UNSIGNED NOT NULL,
  `id_user` bigint UNSIGNED NOT NULL,
  `id_pelanggan` int DEFAULT NULL,
  `diskon` decimal(8,2) DEFAULT '0.00',
  `total_harga` decimal(8,2) NOT NULL,
  `tanggal_penjualan` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `penjualan`
--

INSERT INTO `penjualan` (`id_penjualan`, `id_user`, `id_pelanggan`, `diskon`, `total_harga`, `tanggal_penjualan`) VALUES
(2, 1, 5, 10.00, 13490.00, '2025-03-07 07:46:41'),
(5, 1, 4, 0.00, 87000.00, '2025-03-07 08:27:12'),
(7, 8, 1, 20.00, 76000.00, '2023-03-19 16:41:46'),
(9, 8, 3, 10.00, 171000.00, '2025-03-11 11:30:52'),
(10, 8, 5, 0.00, 15000.00, '2025-03-14 17:03:11'),
(11, 8, NULL, 0.00, 25000.00, '2025-03-15 14:07:58'),
(12, 8, 1, 0.00, 3000.00, '2025-03-16 01:00:08'),
(13, 8, 4, 5.00, 57000.00, '2025-03-16 01:06:57'),
(15, 8, NULL, 0.00, 90000.00, '2025-03-16 13:00:55'),
(16, 8, 6, 5.00, 91200.00, '2025-03-17 22:22:23'),
(17, 8, 7, 10.00, 94950.00, '2025-03-18 00:25:03'),
(19, 8, NULL, 0.00, 43100.00, '2025-03-18 10:30:21'),
(21, 8, NULL, 0.00, 26100.00, '2025-03-18 13:24:18'),
(22, 10, 7, 5.00, 90250.00, '2025-03-18 14:02:40'),
(23, 8, NULL, 0.00, 26100.00, '2025-03-18 14:15:59'),
(24, 8, 1, 0.00, 33750.00, '2024-03-18 17:02:24'),
(25, 8, NULL, 0.00, 67500.00, '2025-03-18 17:26:58'),
(26, 8, 6, 0.00, 23750.00, '2025-03-18 22:39:38');

-- --------------------------------------------------------

--
-- Struktur dari tabel `produk`
--

CREATE TABLE `produk` (
  `id_produk` bigint UNSIGNED NOT NULL,
  `id_kategori` varchar(255) NOT NULL,
  `nama_produk` varchar(255) NOT NULL,
  `harga_beli` decimal(8,2) NOT NULL,
  `harga_jual` decimal(8,2) NOT NULL,
  `stok` smallint NOT NULL,
  `barcode` varchar(15) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `diskon_barang` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `produk`
--

INSERT INTO `produk` (`id_produk`, `id_kategori`, `nama_produk`, `harga_beli`, `harga_jual`, `stok`, `barcode`, `created_at`, `updated_at`, `diskon_barang`) VALUES
(1, 'A001', 'marina handbody', 2800.00, 3000.00, 5, '8999908450807', '2025-02-11 01:41:19', '2025-03-18 11:47:31', 5),
(2, 'A002', 'le mineral', 2500.00, 3000.00, 25, '8996001600269', '2025-02-11 01:41:19', '2025-03-18 11:49:09', 0),
(9, 'A006', 'minyak kayu putih', 18000.00, 20000.00, 4, '8993176110081', '2025-02-11 03:49:29', '2025-03-18 11:49:31', 2),
(12, 'A003', 'ombrella', 59000.00, 60000.00, 19, '8997209272678', '2025-03-04 13:22:43', '2025-03-18 14:25:03', 20),
(13, 'A003', 'two way cake OMG', 20000.00, 25000.00, 17, '8997241850414', '2025-03-07 14:51:21', '2025-03-19 12:39:39', 5),
(14, 'A003', 'eyeliner BNB', 42000.00, 45000.00, 56, '8997227897891', '2025-03-07 14:53:47', '2025-03-19 07:26:58', 25),
(15, 'A003', 'Vitalis parfum', 25000.00, 29000.00, 31, '8992856893672', '2025-03-07 15:02:23', '2025-03-19 04:15:59', 10),
(17, 'A006', 'Panadol cold+flu', 15000.00, 17000.00, 26, '8992695120205', '2025-03-17 22:17:59', '2025-03-19 00:30:21', 0);

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id_user` bigint UNSIGNED NOT NULL,
  `nama_user` varchar(255) NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','petugas') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `alamat` text NOT NULL,
  `hp` varchar(15) NOT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id_user`, `nama_user`, `email`, `username`, `password`, `role`, `alamat`, `hp`, `status`, `created_at`, `updated_at`) VALUES
(1, 'ghaisela', 'ghsl@gmail.com', 'ghaisela', '$2b$10$BgF78ys8iwH5.65C2JoyietwqevnFG3lDiex8V2EjhgH3CHLpdHsq', 'admin', '12', '1213144114', 'Inactive', '2025-02-11 06:41:45', '2025-03-02 07:02:29'),
(3, 'rvr', 'rv@gmail.com', 'river', '$2b$10$38bcNZOu/6BWL5FmUbQT2eCvNZbRJ3fNhrtXUdCxdhFSIg5g4xjCS', 'petugas', 'kasihan', '3434', 'Active', '2025-02-11 06:43:23', '2025-03-13 14:36:15'),
(5, 'ghaisela', 'gsl@gmail.com', 'ghsl123', '$2b$10$YRL.G8FU59B27TNEm9BR6.vTDfgU6h7cBR/kRhB0DbCqrEX4sU8FG', 'admin', 'jl.pucing', '1234567', 'Active', '2025-02-11 00:42:55', '2025-02-27 15:20:55'),
(6, 'arief', 'arr@gmail.com', 'beloved', '$2b$10$wQgAvAezr.XLAtiJfjWHxuMGegkmRiX0q9w1i.w6tW/6MCDWH/pUe', 'admin', 'aku', '09876543', 'Active', '2025-02-27 15:20:37', '2025-02-27 15:20:37'),
(7, 'Admin', 'admin@gmail.com', 'admin', '$2b$10$uJlEqp7yMA/OnFDELV6dW.bcfdFlAM0XyjmSbQRv1/XKXC3RpD0s2', 'admin', 'Bantul yk', '08880980080', 'Active', '2025-03-07 14:55:38', '2025-03-07 14:55:38'),
(8, 'Petugas', 'petugas@gmail.com', 'petugas', '$2b$10$N/t5RTN9G1l186MK91G7NeHZBS9vxNYZTwvd5XuyVgP.gvrQEVyvK', 'petugas', 'Bantul yk', '08888888888', 'Active', '2025-03-07 14:56:48', '2025-03-07 14:56:48'),
(9, 'ujicoba', 'ujicoba@gmail.com', 'ujicoba', '$2b$10$lSX0TqK3vvCuhDA9rN.2reK0JB04fjRt2Q.7zQPgRsfbCNrWUC20C', 'petugas', 'Bantul', '089899898989', 'Active', '2025-03-17 22:20:30', '2025-03-17 22:21:37'),
(10, 'praktek', 'praktek@gmail.com', 'praktek', '$2b$10$QUAIIjR4PMR4SDY5pjnL.eA1gOAePEerci0vTjZO6gpXPWjHFqVXW', 'petugas', 'kjhud', '9809', 'Active', '2025-03-19 03:57:50', '2025-03-19 03:57:50');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `detail_penjualan`
--
ALTER TABLE `detail_penjualan`
  ADD PRIMARY KEY (`id_detail_penjualan`),
  ADD KEY `id_penjualan` (`id_penjualan`),
  ADD KEY `id_produk` (`id_produk`);

--
-- Indeks untuk tabel `kategori`
--
ALTER TABLE `kategori`
  ADD PRIMARY KEY (`id_kategori`);

--
-- Indeks untuk tabel `pelanggan`
--
ALTER TABLE `pelanggan`
  ADD PRIMARY KEY (`id_pelanggan`);

--
-- Indeks untuk tabel `penjualan`
--
ALTER TABLE `penjualan`
  ADD PRIMARY KEY (`id_penjualan`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_pelanggan` (`id_pelanggan`);

--
-- Indeks untuk tabel `produk`
--
ALTER TABLE `produk`
  ADD PRIMARY KEY (`id_produk`),
  ADD KEY `id_kategori` (`id_kategori`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `detail_penjualan`
--
ALTER TABLE `detail_penjualan`
  MODIFY `id_detail_penjualan` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT untuk tabel `pelanggan`
--
ALTER TABLE `pelanggan`
  MODIFY `id_pelanggan` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT untuk tabel `penjualan`
--
ALTER TABLE `penjualan`
  MODIFY `id_penjualan` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT untuk tabel `produk`
--
ALTER TABLE `produk`
  MODIFY `id_produk` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id_user` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `detail_penjualan`
--
ALTER TABLE `detail_penjualan`
  ADD CONSTRAINT `detail_penjualan_ibfk_1` FOREIGN KEY (`id_penjualan`) REFERENCES `penjualan` (`id_penjualan`) ON DELETE CASCADE,
  ADD CONSTRAINT `detail_penjualan_ibfk_2` FOREIGN KEY (`id_produk`) REFERENCES `produk` (`id_produk`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `penjualan`
--
ALTER TABLE `penjualan`
  ADD CONSTRAINT `penjualan_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE,
  ADD CONSTRAINT `penjualan_ibfk_2` FOREIGN KEY (`id_pelanggan`) REFERENCES `pelanggan` (`id_pelanggan`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `produk`
--
ALTER TABLE `produk`
  ADD CONSTRAINT `produk_ibfk_1` FOREIGN KEY (`id_kategori`) REFERENCES `kategori` (`id_kategori`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
