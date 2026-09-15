// storage.js
// Layer data — SEKARANG memanggil backend Express (/api/pengunjung),
// bukan lagi localStorage. Nama file dipertahankan "storage.js" supaya
// import di semua halaman tidak perlu diubah.
//
// Pengecualian: 3 fungsi ambilIdTerakhir/simpanIdTerakhir/hapusIdTerakhir
// TETAP pakai localStorage, karena itu cuma kenyamanan UI di browser ini
// (auto-isi nomor kunjungan terakhir di Form Keluar), bukan data inti yang
// perlu konsisten di semua device — jadi tidak perlu database.

import api from "./client";

// Ambil pesan error yang jelas dari response backend, atau pesan default
function pesanError(err, default_) {
  return err?.response?.data?.error || default_;
}

// GET /api/pengunjung — semua data kunjungan
export async function muatDataTamu() {
  const res = await api.get("/pengunjung");
  return res.data;
}

// POST /api/pengunjung — tamu masuk submit data baru
// Mengembalikan objek kunjungan lengkap dari backend (termasuk id asli
// format DDMMYYYY-NNN yang digenerate server, bukan lagi "T-xxxxx").
export async function kirimKunjungan({ namaTamu, unitKerja, keperluan }) {
  try {
    const res = await api.post("/pengunjung", { namaTamu, unitKerja, keperluan });
    return res.data;
  } catch (err) {
    throw new Error(pesanError(err, "Gagal mengirim data kunjungan."));
  }
}

// GET /api/pengunjung/:id — cek status 1 kunjungan (tombol "Cek Status")
export async function cekStatusKunjungan(id) {
  try {
    const res = await api.get(`/pengunjung/${id}`);
    return res.data;
  } catch (err) {
    throw new Error(pesanError(err, "Nomor kunjungan tidak ditemukan."));
  }
}

// PATCH /api/pengunjung/:id/status — admin approve/reject
// Nama petugas yang memverifikasi otomatis diisi backend dari token JWT
// (siapa yang sedang login), tidak dikirim dari sini.
export async function ubahStatusKunjungan(id, status) {
  try {
    const res = await api.patch(`/pengunjung/${id}/status`, { status });
    return res.data;
  } catch (err) {
    throw new Error(pesanError(err, "Gagal mengubah status."));
  }
}

// POST /api/pengunjung/:id/keluar — konfirmasi tamu keluar
export async function catatKunjunganKeluar(id) {
  try {
    const res = await api.post(`/pengunjung/${id}/keluar`);
    return res.data;
  } catch (err) {
    throw new Error(pesanError(err, "Gagal mencatat kepulangan."));
  }
}

// ===== Bagian ini tetap localStorage (kenyamanan UI, bukan data inti) =====
const KUNCI_ID_TERAKHIR = "bbmkg_id_terakhir";

export function ambilIdTerakhir() {
  return localStorage.getItem(KUNCI_ID_TERAKHIR);
}
export function simpanIdTerakhir(id) {
  localStorage.setItem(KUNCI_ID_TERAKHIR, id);
}
export function hapusIdTerakhir() {
  localStorage.removeItem(KUNCI_ID_TERAKHIR);
}
