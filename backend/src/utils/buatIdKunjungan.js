// utils/buatIdKunjungan.js
// Generate id_pengunjung format DDMMYYYY-NNN (contoh: 08092026-004).
//
// CATATAN PERBAIKAN: versi sebelumnya pakai trik
// "ON DUPLICATE KEY UPDATE ... LAST_INSERT_ID(expr)", tapi LAST_INSERT_ID()
// itu terikat per-koneksi. Karena pool.query() bisa memakai koneksi
// berbeda tiap panggilan, nilainya jadi tidak bisa diandalkan (kadang
// undefined). Versi ini memakai satu koneksi yang sama untuk seluruh
// transaksi, dengan SELECT ... FOR UPDATE untuk mengunci baris nomor
// selama transaksi berjalan — aman dari race condition walau ada beberapa
// submit bersamaan.

async function formatTanggalId(date) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}${mm}${yyyy}`;
}

async function buatIdKunjungan(pool) {
  const tanggal = await formatTanggalId(new Date());
  const koneksi = await pool.getConnection();

  try {
    await koneksi.beginTransaction();

    // FOR UPDATE mengunci baris ini (atau gap-nya kalau belum ada) sampai
    // transaksi commit/rollback, supaya submit lain untuk tanggal yang sama
    // harus menunggu giliran, tidak bisa dapat nomor yang sama.
    const [baris] = await koneksi.query(
      `SELECT nomor FROM nomor_kunjungan WHERE tanggal = ? FOR UPDATE`,
      [tanggal]
    );

    let nomorBaru;
    if (baris.length === 0) {
      nomorBaru = 1;
      await koneksi.query(
        `INSERT INTO nomor_kunjungan (tanggal, nomor) VALUES (?, ?)`,
        [tanggal, nomorBaru]
      );
    } else {
      nomorBaru = baris[0].nomor + 1;
      await koneksi.query(
        `UPDATE nomor_kunjungan SET nomor = ? WHERE tanggal = ?`,
        [nomorBaru, tanggal]
      );
    }

    await koneksi.commit();

    const nomorUrut = String(nomorBaru).padStart(3, "0");
    return `${tanggal}-${nomorUrut}`;
  } catch (err) {
    await koneksi.rollback();
    throw err;
  } finally {
    koneksi.release();
  }
}

module.exports = { buatIdKunjungan };