-- ============================================================
-- SISTEM INFORMASI DATA SANTRI
-- Masjid Nurul Iman
-- Database: MySQL 8.0+
-- Metode Pengembangan: Waterfall
-- ============================================================

-- Hapus database jika sudah ada
DROP DATABASE IF EXISTS db_santri_nurul_iman;

-- Buat database baru
CREATE DATABASE db_santri_nurul_iman
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE db_santri_nurul_iman;

-- ============================================================
-- TABEL 1: users (Pengguna Sistem)
-- ============================================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nama_lengkap VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    no_hp VARCHAR(15),
    role ENUM('admin', 'pengurus', 'ustadz') NOT NULL DEFAULT 'pengurus',
    foto VARCHAR(255) DEFAULT NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    last_login DATETIME DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_role (role)
) ENGINE=InnoDB;

-- ============================================================
-- TABEL 2: santri (Data Santri)
-- ============================================================
CREATE TABLE santri (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nis VARCHAR(20) NOT NULL UNIQUE,
    nama_lengkap VARCHAR(100) NOT NULL,
    nama_panggilan VARCHAR(50),
    jenis_kelamin ENUM('L', 'P') NOT NULL DEFAULT 'L',
    tempat_lahir VARCHAR(50),
    tanggal_lahir DATE,
    alamat TEXT,
    rt VARCHAR(5) DEFAULT NULL,
    rw VARCHAR(5) DEFAULT NULL,
    kelurahan VARCHAR(50),
    kecamatan VARCHAR(50),
    kota VARCHAR(50),
    kode_pos VARCHAR(10),
    no_hp_santri VARCHAR(15),
    no_hp_wali VARCHAR(15),
    nama_wali VARCHAR(100),
    hubungan_wali VARCHAR(30) DEFAULT 'Orang Tua',
    kelas ENUM('Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6') NOT NULL,
    foto VARCHAR(255) DEFAULT NULL,
    tanggal_daftar DATE NOT NULL,
    status ENUM('aktif', 'alumni', 'nonaktif') NOT NULL DEFAULT 'aktif',
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_nis (nis),
    INDEX idx_nama (nama_lengkap),
    INDEX idx_kelas (kelas),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- ============================================================
-- TABEL 3: hafalan (Monitoring Hafalan Al-Quran)
-- ============================================================
CREATE TABLE hafalan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    santri_id INT NOT NULL,
    tanggal DATE NOT NULL,
    surat VARCHAR(50) NOT NULL,
    nomor_surat INT,
    ayat_mulai INT NOT NULL,
    ayat_selesai INT NOT NULL,
    juz INT,
    halaman INT,
    status ENUM('lancar', 'kurang_lancar', 'belum_lancar') NOT NULL DEFAULT 'belum_lancar',
    nilai INT DEFAULT NULL CHECK (nilai >= 0 AND nilai <= 100),
    catatan TEXT,
    penguji VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (santri_id) REFERENCES santri(id) ON DELETE CASCADE,
    INDEX idx_santri_tanggal (santri_id, tanggal),
    INDEX idx_surat (surat),
    INDEX idx_status (status),
    INDEX idx_juz (juz)
) ENGINE=InnoDB;

-- ============================================================
-- TABEL 4: kehadiran (Absensi Santri)
-- ============================================================
CREATE TABLE kehadiran (
    id INT AUTO_INCREMENT PRIMARY KEY,
    santri_id INT NOT NULL,
    tanggal DATE NOT NULL,
    status ENUM('hadir', 'izin', 'sakit', 'alpha') NOT NULL DEFAULT 'hadir',
    keterangan TEXT,
    jam_masuk TIME DEFAULT NULL,
    jam_keluar TIME DEFAULT NULL,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (santri_id) REFERENCES santri(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_kehadiran (santri_id, tanggal),
    INDEX idx_tanggal (tanggal),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- ============================================================
-- TABEL 5: iuran (Pembayaran Iuran Bulanan)
-- ============================================================
CREATE TABLE iuran (
    id INT AUTO_INCREMENT PRIMARY KEY,
    santri_id INT NOT NULL,
    bulan ENUM('Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember') NOT NULL,
    tahun INT NOT NULL CHECK (tahun >= 2020),
    jumlah_tagihan DECIMAL(12,2) NOT NULL DEFAULT 50000,
    jumlah_bayar DECIMAL(12,2) NOT NULL DEFAULT 0,
    status ENUM('lunas', 'sebagian', 'belum_bayar') NOT NULL DEFAULT 'belum_bayar',
    tanggal_bayar DATE DEFAULT NULL,
    metode_bayar ENUM('tunai', 'transfer', 'qris') DEFAULT 'tunai',
    keterangan TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (santri_id) REFERENCES santri(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_iuran (santri_id, bulan, tahun),
    INDEX idx_bulan_tahun (bulan, tahun),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- ============================================================
-- TABEL 6: log_aktivitas (Audit Trail)
-- ============================================================
CREATE TABLE log_aktivitas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    aksi VARCHAR(50) NOT NULL,
    tabel VARCHAR(50) NOT NULL,
    record_id INT,
    deskripsi TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_aksi (aksi),
    INDEX idx_tabel (tabel),
    INDEX idx_created (created_at)
) ENGINE=InnoDB;

-- ============================================================
-- VIEW: Ringkasan Kehadiran per Santri
-- ============================================================
CREATE VIEW v_ringkasan_kehadiran AS
SELECT 
    s.id AS santri_id,
    s.nis,
    s.nama_lengkap,
    s.kelas,
    COUNT(CASE WHEN k.status = 'hadir' THEN 1 END) AS total_hadir,
    COUNT(CASE WHEN k.status = 'izin' THEN 1 END) AS total_izin,
    COUNT(CASE WHEN k.status = 'sakit' THEN 1 END) AS total_sakit,
    COUNT(CASE WHEN k.status = 'alpha' THEN 1 END) AS total_alpha,
    COUNT(k.id) AS total_pertemuan,
    ROUND(
        (COUNT(CASE WHEN k.status = 'hadir' THEN 1 END) / NULLIF(COUNT(k.id), 0)) * 100, 1
    ) AS persentase_kehadiran
FROM santri s
LEFT JOIN kehadiran k ON s.id = k.santri_id
WHERE s.status = 'aktif'
GROUP BY s.id, s.nis, s.nama_lengkap, s.kelas;

-- ============================================================
-- VIEW: Ringkasan Hafalan per Santri
-- ============================================================
CREATE VIEW v_ringkasan_hafalan AS
SELECT 
    s.id AS santri_id,
    s.nis,
    s.nama_lengkap,
    s.kelas,
    COUNT(h.id) AS total_hafalan,
    COUNT(CASE WHEN h.status = 'lancar' THEN 1 END) AS hafalan_lancar,
    COUNT(CASE WHEN h.status = 'kurang_lancar' THEN 1 END) AS hafalan_kurang,
    COUNT(CASE WHEN h.status = 'belum_lancar' THEN 1 END) AS hafalan_belum,
    MAX(h.tanggal) AS hafalan_terakhir,
    GROUP_CONCAT(DISTINCT h.surat ORDER BY h.nomor_surat SEPARATOR ', ') AS surat_dihafal
FROM santri s
LEFT JOIN hafalan h ON s.id = h.santri_id
WHERE s.status = 'aktif'
GROUP BY s.id, s.nis, s.nama_lengkap, s.kelas;

-- ============================================================
-- VIEW: Ringkasan Iuran per Santri
-- ============================================================
CREATE VIEW v_ringkasan_iuran AS
SELECT 
    s.id AS santri_id,
    s.nis,
    s.nama_lengkap,
    s.kelas,
    i.tahun,
    COUNT(i.id) AS total_bulan,
    COUNT(CASE WHEN i.status = 'lunas' THEN 1 END) AS bulan_lunas,
    COUNT(CASE WHEN i.status = 'sebagian' THEN 1 END) AS bulan_sebagian,
    COUNT(CASE WHEN i.status = 'belum_bayar' THEN 1 END) AS bulan_belum,
    SUM(i.jumlah_tagihan) AS total_tagihan,
    SUM(i.jumlah_bayar) AS total_terbayar,
    SUM(i.jumlah_tagihan) - SUM(i.jumlah_bayar) AS sisa_tagihan
FROM santri s
LEFT JOIN iuran i ON s.id = i.santri_id
WHERE s.status = 'aktif'
GROUP BY s.id, s.nis, s.nama_lengkap, s.kelas, i.tahun;

-- ============================================================
-- STORED PROCEDURE: Laporan Bulanan
-- ============================================================
DELIMITER //
CREATE PROCEDURE sp_laporan_bulanan(IN p_bulan VARCHAR(20), IN p_tahun INT)
BEGIN
    -- Laporan kehadiran
    SELECT 
        'KEHADIRAN' AS kategori,
        COUNT(*) AS total,
        SUM(CASE WHEN status = 'hadir' THEN 1 ELSE 0 END) AS hadir,
        SUM(CASE WHEN status = 'izin' THEN 1 ELSE 0 END) AS izin,
        SUM(CASE WHEN status = 'sakit' THEN 1 ELSE 0 END) AS sakit,
        SUM(CASE WHEN status = 'alpha' THEN 1 ELSE 0 END) AS alpha
    FROM kehadiran
    WHERE MONTHNAME(tanggal) = p_bulan AND YEAR(tanggal) = p_tahun;
    
    -- Laporan hafalan
    SELECT 
        'HAFALAN' AS kategori,
        COUNT(*) AS total,
        SUM(CASE WHEN status = 'lancar' THEN 1 ELSE 0 END) AS lancar,
        SUM(CASE WHEN status = 'kurang_lancar' THEN 1 ELSE 0 END) AS kurang_lancar,
        SUM(CASE WHEN status = 'belum_lancar' THEN 1 ELSE 0 END) AS belum_lancar
    FROM hafalan
    WHERE MONTHNAME(tanggal) = p_bulan AND YEAR(tanggal) = p_tahun;
    
    -- Laporan iuran
    SELECT 
        'IURAN' AS kategori,
        COUNT(*) AS total_santri,
        SUM(CASE WHEN status = 'lunas' THEN 1 ELSE 0 END) AS lunas,
        SUM(CASE WHEN status = 'sebagian' THEN 1 ELSE 0 END) AS sebagian,
        SUM(CASE WHEN status = 'belum_bayar' THEN 1 ELSE 0 END) AS belum_bayar,
        SUM(jumlah_bayar) AS total_terkumpul
    FROM iuran
    WHERE bulan = p_bulan AND tahun = p_tahun;
END //
DELIMITER ;

-- ============================================================
-- TRIGGER: Auto-update status iuran
-- ============================================================
DELIMITER //
CREATE TRIGGER trg_update_status_iuran
BEFORE UPDATE ON iuran
FOR EACH ROW
BEGIN
    IF NEW.jumlah_bayar >= NEW.jumlah_tagihan THEN
        SET NEW.status = 'lunas';
    ELSEIF NEW.jumlah_bayar > 0 THEN
        SET NEW.status = 'sebagian';
    ELSE
        SET NEW.status = 'belum_bayar';
    END IF;
    
    IF NEW.jumlah_bayar > 0 AND NEW.tanggal_bayar IS NULL THEN
        SET NEW.tanggal_bayar = CURDATE();
    END IF;
END //
DELIMITER ;
