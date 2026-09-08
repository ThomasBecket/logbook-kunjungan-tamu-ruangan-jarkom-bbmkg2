-- =========================================================
-- kunjungan_jarkom — skema revisi
-- Perubahan dari versi awal:
--   1. Tabel `pengunjung`: tambah kolom `status`, `waktu_keluar` jadi NULLable
--   2. Tabel baru `pengunjung_nama`: relasi 1-ke-banyak untuk tamu rombongan
--   3. Tabel `admin`: id_admin jadi AUTO_INCREMENT
-- =========================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
SET NAMES utf8mb4;

-- --------------------------------------------------------
-- Tabel: admin
-- --------------------------------------------------------
CREATE TABLE `admin` (
  `id_admin` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,  -- simpan hash bcrypt, jangan plaintext
  PRIMARY KEY (`id_admin`),
  UNIQUE KEY `uq_username` (`username`)
);

-- --------------------------------------------------------
-- Tabel: pengunjung
-- Satu baris = satu kunjungan (bisa untuk rombongan)
-- --------------------------------------------------------
CREATE TABLE `pengunjung` (
  `id_pengunjung` VARCHAR(12) NOT NULL,          -- contoh: 09022026-001
  `unit_kerja_instansi` VARCHAR(255) NOT NULL,
  `keperluan` TEXT NOT NULL,
  `status` VARCHAR(30) NOT NULL DEFAULT 'Menunggu Persetujuan',
  `waktu_masuk` DATETIME NOT NULL,
  `waktu_keluar` DATETIME NULL DEFAULT NULL,     -- baru terisi saat tamu keluar
  PRIMARY KEY (`id_pengunjung`)
);

-- --------------------------------------------------------
-- Tabel: pengunjung_nama
-- Menyimpan nama-nama tamu dalam satu kunjungan (rombongan)
-- --------------------------------------------------------
CREATE TABLE `pengunjung_nama` (
  `id_nama` INT(11) NOT NULL AUTO_INCREMENT,
  `id_pengunjung` VARCHAR(12) NOT NULL,
  `nama` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id_nama`),
  KEY `idx_id_pengunjung` (`id_pengunjung`),
  CONSTRAINT `fk_pengunjung_nama_pengunjung`
    FOREIGN KEY (`id_pengunjung`) REFERENCES `pengunjung` (`id_pengunjung`)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- --------------------------------------------------------
-- Tabel: nomor_kunjungan
-- Menyimpan nomor urut kunjungan per tanggal
-- Nomor urut digenerate ke id_pengunjung dengan format DDMMYYYY-NNN (contoh: 09022026-001)
-- --------------------------------------------------------
CREATE TABLE `nomor_kunjungan` (
  `tanggal` VARCHAR(8) NOT NULL,   -- format DDMMYYYY
  `nomor` INT(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`tanggal`)
);

COMMIT;
