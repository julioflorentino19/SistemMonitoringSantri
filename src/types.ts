export interface Santri {
  id: string;
  nama: string;
  usia: number;
  kelas: string;
  alamat: string;
  noHp: string;
  foto: string;
  tanggalDaftar: string;
}

export interface HafalanRecord {
  id: string;
  santriId: string;
  tanggal: string;
  surat: string;
  ayat: string;
  juz: number;
  status: 'lancar' | 'kurang_lancar' | 'belum_lancar';
  catatan: string;
}

export interface KehadiranRecord {
  id: string;
  santriId: string;
  tanggal: string;
  status: 'hadir' | 'izin' | 'sakit' | 'alpha';
  keterangan: string;
}

export interface IuranRecord {
  id: string;
  santriId: string;
  bulan: string;
  tahun: number;
  jumlah: number;
  status: 'lunas' | 'belum_bayar' | 'sebagian';
  tanggalBayar: string | null;
}

export type Page = 'dashboard' | 'santri' | 'hafalan' | 'kehadiran' | 'iuran' | 'profil';
