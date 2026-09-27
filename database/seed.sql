-- ============================================================
-- SEED DATA - Sistem Informasi Data Santri
-- Masjid Nurul Iman
-- ============================================================

USE db_santri_nurul_iman;

-- ============================================================
-- Data Users (Password: admin123 = bcrypt hash)
-- ============================================================
INSERT INTO users (username, password, nama_lengkap, email, no_hp, role) VALUES
('admin', '$2b$10$rQR5kFXjL3VxR8yWZ0qZxeY5m7F4gN5xL8zK1vM2pQ7wE3tY6uA0i', 'Ahmad Syaiful', 'admin@nuruliman.or.id', '081234567800', 'admin'),
('ustadz_ali', '$2b$10$rQR5kFXjL3VxR8yWZ0qZxeY5m7F4gN5xL8zK1vM2pQ7wE3tY6uA0i', 'Ustadz Ali Imron', 'ali@nuruliman.or.id', '081234567801', 'ustadz'),
('pengurus_budi', '$2b$10$rQR5kFXjL3VxR8yWZ0qZxeY5m7F4gN5xL8zK1vM2pQ7wE3tY6uA0i', 'Budi Santoso', 'budi@nuruliman.or.id', '081234567802', 'pengurus');

-- ============================================================
-- Data Santri
-- ============================================================
INSERT INTO santri (nis, nama_lengkap, nama_panggilan, jenis_kelamin, tempat_lahir, tanggal_lahir, alamat, kelurahan, kecamatan, kota, no_hp_wali, nama_wali, kelas, tanggal_daftar, status) VALUES
('2023001', 'Ahmad Fauzi Rahman', 'Fauzi', 'L', 'Jakarta', '2012-03-15', 'Jl. Mawar No. 5 RT 03/02', 'Sukamaju', 'Cimanggis', 'Depok', '081234567890', 'H. Rahman', 'Kelas 1', '2023-01-15', 'aktif'),
('2023002', 'Siti Aisyah Putri', 'Aisyah', 'P', 'Jakarta', '2014-07-22', 'Jl. Melati No. 12 RT 01/04', 'Sukamaju', 'Cimanggis', 'Depok', '081234567891', 'Hj. Fatimah', 'Kelas 1', '2023-02-20', 'aktif'),
('2023003', 'Muhammad Rizki Aditya', 'Rizki', 'L', 'Bogor', '2010-11-08', 'Jl. Anggrek No. 8 RT 02/01', 'Curug', 'Cimanggis', 'Depok', '081234567892', 'Ir. Aditya', 'Kelas 2', '2023-01-10', 'aktif'),
('2023004', 'Fatimah Zahra Salsabila', 'Fatimah', 'P', 'Jakarta', '2013-05-30', 'Jl. Kenanga No. 3 RT 05/03', 'Sukamaju', 'Cimanggis', 'Depok', '081234567893', 'Drs. Salsabila', 'Kelas 1', '2023-03-05', 'aktif'),
('2023005', 'Abdullah Hakim Pratama', 'Abdullah', 'L', 'Depok', '2011-09-14', 'Jl. Dahlia No. 15 RT 04/02', 'Sukmajaya', 'Sukmajaya', 'Depok', '081234567894', 'H. Pratama', 'Kelas 2', '2023-01-20', 'aktif'),
('2023006', 'Khadijah Amina Rahma', 'Khadijah', 'P', 'Jakarta', '2014-01-25', 'Jl. Tulip No. 7 RT 02/05', 'Sukamaju', 'Cimanggis', 'Depok', '081234567895', 'Hj. Rahma', 'Kelas 1', '2023-04-01', 'aktif'),
('2023007', 'Umar Faruq Nugroho', 'Umar', 'L', 'Bogor', '2009-12-03', 'Jl. Sakura No. 9 RT 03/01', 'Curug', 'Cimanggis', 'Depok', '081234567896', 'H. Nugroho', 'Kelas 3', '2022-08-15', 'aktif'),
('2023008', 'Maryam Shalihah Dewi', 'Maryam', 'P', 'Jakarta', '2012-06-18', 'Jl. Kamboja No. 4 RT 01/03', 'Sukamaju', 'Cimanggis', 'Depok', '081234567897', 'Hj. Dewi', 'Kelas 2', '2023-02-10', 'aktif'),
('2023009', 'Ibrahim Adha Wijaya', 'Ibrahim', 'L', 'Depok', '2010-04-07', 'Jl. Cempaka No. 11 RT 05/01', 'Sukmajaya', 'Sukmajaya', 'Depok', '081234567898', 'H. Wijaya', 'Kelas 2', '2023-01-25', 'aktif'),
('2023010', 'Aisyah Putri Ramadhani', 'Aisyah P', 'P', 'Jakarta', '2013-10-12', 'Jl. Flamboyan No. 6 RT 02/04', 'Sukamaju', 'Cimanggis', 'Depok', '081234567899', 'Hj. Ramadhani', 'Kelas 1', '2023-05-01', 'aktif'),
('2023011', 'Yusuf Mansur Hakim', 'Yusuf', 'L', 'Bogor', '2011-02-28', 'Jl. Mawar Indah No. 2 RT 03/02', 'Sukamaju', 'Cimanggis', 'Depok', '081234567810', 'H. Hakim', 'Kelas 3', '2022-09-01', 'aktif'),
('2023012', 'Zainab Al-Husna', 'Zainab', 'P', 'Jakarta', '2012-08-19', 'Jl. Melati Putih No. 8 RT 01/02', 'Sukamaju', 'Cimanggis', 'Depok', '081234567811', 'Hj. Husna', 'Kelas 2', '2023-03-15', 'aktif');

-- ============================================================
-- Data Hafalan
-- ============================================================
INSERT INTO hafalan (santri_id, tanggal, surat, nomor_surat, ayat_mulai, ayat_selesai, juz, halaman, status, nilai, catatan, penguji) VALUES
(1, '2024-01-15', 'Al-Baqarah', 2, 1, 10, 1, 2, 'lancar', 90, 'Masya Allah, sangat lancar dan tajwid baik', 'Ustadz Ali'),
(1, '2024-01-16', 'Al-Baqarah', 2, 11, 20, 1, 2, 'kurang_lancar', 70, 'Perlu mengulang ayat 15-17, tajwid masih kurang', 'Ustadz Ali'),
(1, '2024-01-17', 'Al-Baqarah', 2, 21, 30, 1, 3, 'lancar', 85, 'Perkembangan baik, terus tingkatkan', 'Ustadz Ali'),
(2, '2024-01-15', 'Al-Fatihah', 1, 1, 7, 30, 604, 'lancar', 95, 'Sudah sangat baik, hafalan kuat', 'Ustadz Ali'),
(2, '2024-01-16', 'Al-Baqarah', 2, 1, 5, 1, 2, 'lancar', 80, 'Bagus, terus tingkatkan hafalan', 'Ustadz Ali'),
(2, '2024-01-17', 'Al-Baqarah', 2, 6, 15, 1, 2, 'kurang_lancar', 65, 'Masih perlu latihan makhraj huruf', 'Ustadz Ali'),
(3, '2024-01-15', 'Ali Imran', 3, 1, 15, 3, 50, 'kurang_lancar', 60, 'Perlu latihan tajwid lebih banyak', 'Ustadz Ali'),
(3, '2024-01-16', 'Ali Imran', 3, 16, 30, 3, 51, 'lancar', 82, 'Perkembangan baik hari ini', 'Ustadz Ali'),
(3, '2024-01-17', 'Ali Imran', 3, 31, 45, 3, 52, 'lancar', 88, 'Masya Allah, sangat baik', 'Ustadz Ali'),
(4, '2024-01-15', 'An-Nisa', 4, 1, 10, 4, 77, 'belum_lancar', 45, 'Perlu bimbingan lebih intensif', 'Ustadz Ali'),
(4, '2024-01-16', 'An-Nisa', 4, 11, 20, 4, 78, 'kurang_lancar', 55, 'Sudah ada kemajuan, terus semangat', 'Ustadz Ali'),
(5, '2024-01-15', 'Al-Maidah', 5, 1, 12, 6, 106, 'lancar', 92, 'Hafalan sangat kuat dan konsisten', 'Ustadz Ali'),
(5, '2024-01-16', 'Al-Maidah', 5, 13, 25, 6, 107, 'lancar', 90, 'Masya Allah, luar biasa', 'Ustadz Ali'),
(6, '2024-01-15', 'An-Nas', 114, 1, 6, 30, 604, 'lancar', 98, 'Sudah sempurna, hafalan sangat baik', 'Ustadz Ali'),
(6, '2024-01-16', 'Al-Falaq', 113, 1, 5, 30, 604, 'lancar', 95, 'Sangat bagus', 'Ustadz Ali'),
(7, '2024-01-15', 'Yasin', 36, 1, 20, 22, 440, 'lancar', 88, 'Masya Allah, konsisten dan baik', 'Ustadz Ali'),
(7, '2024-01-16', 'Yasin', 36, 21, 40, 22, 441, 'lancar', 85, 'Tajwid sudah sangat baik', 'Ustadz Ali'),
(8, '2024-01-16', 'Al-Kahfi', 18, 1, 10, 15, 293, 'kurang_lancar', 60, 'Perlu mengulang beberapa ayat', 'Ustadz Ali'),
(8, '2024-01-17', 'Al-Kahfi', 18, 11, 20, 15, 294, 'kurang_lancar', 58, 'Masih perlu banyak latihan', 'Ustadz Ali'),
(9, '2024-01-16', 'Ar-Rahman', 55, 1, 15, 27, 531, 'lancar', 87, 'Tajwid sudah baik, suara merdu', 'Ustadz Ali'),
(9, '2024-01-17', 'Ar-Rahman', 55, 16, 30, 27, 532, 'lancar', 90, 'Sangat baik, terus pertahankan', 'Ustadz Ali'),
(10, '2024-01-16', 'Al-Mulk', 67, 1, 10, 29, 562, 'kurang_lancar', 62, 'Masih menghafal, perlu pengulangan', 'Ustadz Ali'),
(10, '2024-01-17', 'Al-Mulk', 67, 11, 20, 29, 563, 'belum_lancar', 50, 'Perlu bimbingan tambahan', 'Ustadz Ali'),
(11, '2024-01-15', 'Al-Hujurat', 49, 1, 10, 26, 515, 'lancar', 85, 'Hafalan kuat, tajwid baik', 'Ustadz Ali'),
(12, '2024-01-16', 'Maryam', 19, 1, 15, 16, 305, 'kurang_lancar', 65, 'Perlu latihan makhraj', 'Ustadz Ali');

-- ============================================================
-- Data Kehadiran (Januari 2024)
-- ============================================================
INSERT INTO kehadiran (santri_id, tanggal, status, keterangan, jam_masuk, jam_keluar, created_by) VALUES
-- Tanggal 15 Januari 2024
(1, '2024-01-15', 'hadir', NULL, '15:30:00', '17:00:00', 1),
(2, '2024-01-15', 'hadir', NULL, '15:25:00', '17:00:00', 1),
(3, '2024-01-15', 'sakit', 'Demam tinggi', NULL, NULL, 1),
(4, '2024-01-15', 'hadir', NULL, '15:30:00', '17:00:00', 1),
(5, '2024-01-15', 'hadir', NULL, '15:28:00', '17:00:00', 1),
(6, '2024-01-15', 'izin', 'Acara keluarga', NULL, NULL, 1),
(7, '2024-01-15', 'hadir', NULL, '15:20:00', '17:00:00', 1),
(8, '2024-01-15', 'hadir', NULL, '15:35:00', '17:00:00', 1),
(9, '2024-01-15', 'alpha', NULL, NULL, NULL, 1),
(10, '2024-01-15', 'hadir', NULL, '15:30:00', '17:00:00', 1),
(11, '2024-01-15', 'hadir', NULL, '15:25:00', '17:00:00', 1),
(12, '2024-01-15', 'hadir', NULL, '15:32:00', '17:00:00', 1),

-- Tanggal 16 Januari 2024
(1, '2024-01-16', 'hadir', NULL, '15:30:00', '17:00:00', 1),
(2, '2024-01-16', 'hadir', NULL, '15:28:00', '17:00:00', 1),
(3, '2024-01-16', 'hadir', NULL, '15:30:00', '17:00:00', 1),
(4, '2024-01-16', 'hadir', NULL, '15:35:00', '17:00:00', 1),
(5, '2024-01-16', 'sakit', 'Flu dan batuk', NULL, NULL, 1),
(6, '2024-01-16', 'hadir', NULL, '15:30:00', '17:00:00', 1),
(7, '2024-01-16', 'hadir', NULL, '15:20:00', '17:00:00', 1),
(8, '2024-01-16', 'izin', 'Kontrol dokter', NULL, NULL, 1),
(9, '2024-01-16', 'hadir', NULL, '15:30:00', '17:00:00', 1),
(10, '2024-01-16', 'hadir', NULL, '15:30:00', '17:00:00', 1),
(11, '2024-01-16', 'hadir', NULL, '15:25:00', '17:00:00', 1),
(12, '2024-01-16', 'alpha', NULL, NULL, NULL, 1),

-- Tanggal 17 Januari 2024
(1, '2024-01-17', 'hadir', NULL, '15:30:00', '17:00:00', 1),
(2, '2024-01-17', 'hadir', NULL, '15:25:00', '17:00:00', 1),
(3, '2024-01-17', 'hadir', NULL, '15:30:00', '17:00:00', 1),
(4, '2024-01-17', 'hadir', NULL, '15:30:00', '17:00:00', 1),
(5, '2024-01-17', 'hadir', NULL, '15:28:00', '17:00:00', 1),
(6, '2024-01-17', 'hadir', NULL, '15:35:00', '17:00:00', 1),
(7, '2024-01-17', 'sakit', 'Sakit perut', NULL, NULL, 1),
(8, '2024-01-17', 'hadir', NULL, '15:30:00', '17:00:00', 1),
(9, '2024-01-17', 'hadir', NULL, '15:30:00', '17:00:00', 1),
(10, '2024-01-17', 'hadir', NULL, '15:30:00', '17:00:00', 1),
(11, '2024-01-17', 'hadir', NULL, '15:25:00', '17:00:00', 1),
(12, '2024-01-17', 'hadir', NULL, '15:32:00', '17:00:00', 1);

-- ============================================================
-- Data Iuran (Januari 2024)
-- ============================================================
INSERT INTO iuran (santri_id, bulan, tahun, jumlah_tagihan, jumlah_bayar, status, tanggal_bayar, metode_bayar, keterangan, created_by) VALUES
(1, 'Januari', 2024, 50000, 50000, 'lunas', '2024-01-05', 'tunai', NULL, 1),
(2, 'Januari', 2024, 50000, 50000, 'lunas', '2024-01-03', 'transfer', 'Transfer BCA', 1),
(3, 'Januari', 2024, 50000, 30000, 'sebagian', '2024-01-10', 'tunai', 'Sisa akan dibayar minggu depan', 1),
(4, 'Januari', 2024, 50000, 50000, 'lunas', '2024-01-07', 'tunai', NULL, 1),
(5, 'Januari', 2024, 50000, 0, 'belum_bayar', NULL, NULL, NULL, 1),
(6, 'Januari', 2024, 50000, 50000, 'lunas', '2024-01-02', 'qris', 'Bayar via QRIS', 1),
(7, 'Januari', 2024, 50000, 50000, 'lunas', '2024-01-04', 'tunai', NULL, 1),
(8, 'Januari', 2024, 50000, 25000, 'sebagian', '2024-01-12', 'tunai', 'Sisa akan dilunasi', 1),
(9, 'Januari', 2024, 50000, 0, 'belum_bayar', NULL, NULL, NULL, 1),
(10, 'Januari', 2024, 50000, 50000, 'lunas', '2024-01-06', 'transfer', 'Transfer Mandiri', 1),
(11, 'Januari', 2024, 50000, 50000, 'lunas', '2024-01-08', 'tunai', NULL, 1),
(12, 'Januari', 2024, 50000, 50000, 'lunas', '2024-01-09', 'tunai', NULL, 1);

-- ============================================================
-- Data Log Aktivitas
-- ============================================================
INSERT INTO log_aktivitas (user_id, aksi, tabel, record_id, deskripsi, ip_address) VALUES
(1, 'INSERT', 'santri', 1, 'Menambahkan santri baru: Ahmad Fauzi Rahman', '192.168.1.100'),
(1, 'INSERT', 'santri', 2, 'Menambahkan santri baru: Siti Aisyah Putri', '192.168.1.100'),
(1, 'INSERT', 'hafalan', 1, 'Mencatat hafalan baru: Ahmad Fauzi - Al-Baqarah 1-10', '192.168.1.100'),
(1, 'UPDATE', 'kehadiran', 3, 'Update status kehadiran: Muhammad Rizki - Sakit', '192.168.1.100'),
(1, 'INSERT', 'iuran', 1, 'Mencatat pembayaran iuran: Ahmad Fauzi - Januari 2024', '192.168.1.100'),
(1, 'LOGIN', 'users', 1, 'Login berhasil', '192.168.1.100');
