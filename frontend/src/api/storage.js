// storage.js
// Layer data untuk data kunjungan. Untuk sekarang masih pakai localStorage
// (nanti tiap fungsi di sini akan diganti isinya jadi panggilan axios ke
// backend /api/pengunjung, tanpa perlu mengubah kode di pages/ yang
// memanggilnya).

const KUNCI = "bbmkg_tamu_v1";
const KUNCI_ID_TERAKHIR = "bbmkg_id_terakhir";

export function muatDataTamu() {
  try {
    return JSON.parse(localStorage.getItem(KUNCI)) || [];
  } catch {
    return [];
  }
}

export function simpanDataTamu(data) {
  localStorage.setItem(KUNCI, JSON.stringify(data));
}

// TODO: setelah backend siap, id akan digenerate di server dengan format
// DDMMYYYY-NNN (lihat buatIdKunjungan.js di backend). Untuk sekarang masih
// pakai format sementara T-XXXXXX di sisi frontend.
export function buatIdKunjungan() {
  return "T-" + Date.now().toString(36).toUpperCase();
}

export function waktuIsoSekarang() {
  return new Date().toISOString();
}

export function formatTanggal(isoString) {
  if (!isoString) return "-";
  return (
    new Date(isoString).toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) + " WIB"
  );
}

export function formatWaktuSekarang() {
  return formatTanggal(waktuIsoSekarang());
}

export function ambilIdTerakhir() {
  return localStorage.getItem(KUNCI_ID_TERAKHIR);
}

export function simpanIdTerakhir(id) {
  localStorage.setItem(KUNCI_ID_TERAKHIR, id);
}

export function hapusIdTerakhir() {
  localStorage.removeItem(KUNCI_ID_TERAKHIR);
}
