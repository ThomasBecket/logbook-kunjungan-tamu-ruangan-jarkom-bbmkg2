// utils/formatTanggal.js
// Dua fungsi kecil untuk mengubah DATETIME dari MySQL jadi 2 bentuk yang
// dibutuhkan frontend: versi tampilan (Indonesia, "DD/MM/YYYY, HH:mm WIB")
// dan versi ISO mentah (dipakai frontend untuk sort/filter tanggal).

function formatTampilan(tanggal) {
  if (!tanggal) return null;
  return (
    new Date(tanggal).toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) + " WIB"
  );
}

function keFormatIso(tanggal) {
  if (!tanggal) return null;
  return new Date(tanggal).toISOString();
}

module.exports = { formatTampilan, keFormatIso };
