// models/pengunjungModel.js
// Layer Model (huruf M di MVC): semua query SQL mentah ke tabel
// pengunjung/pengunjung_nama ada DI SINI SAJA. Controller tidak menulis SQL
// sama sekali — cukup panggil fungsi-fungsi di file ini.

const pool = require("../database");
const { buatIdKunjungan } = require("../utils/buatIdKunjungan");
const { formatTampilan, keFormatIso } = require("../utils/formatTanggal");

const QUERY_DASAR = `
  SELECT
    p.id_pengunjung AS id,
    p.unit_kerja_instansi AS unitKerja,
    p.keperluan AS keperluan,
    p.status AS status,
    p.waktu_masuk AS waktuMasukMentah,
    p.waktu_keluar AS waktuKeluarMentah,
    GROUP_CONCAT(n.nama ORDER BY n.id_nama SEPARATOR '||') AS namaMentah
  FROM pengunjung p
  LEFT JOIN pengunjung_nama n ON n.id_pengunjung = p.id_pengunjung
`;

function petakanBaris(baris) {
  return {
    id: baris.id,
    namaTamu: baris.namaMentah ? baris.namaMentah.split("||") : [],
    unitKerja: baris.unitKerja,
    keperluan: baris.keperluan,
    status: baris.status,
    waktuMasukIso: keFormatIso(baris.waktuMasukMentah),
    waktuMasuk: formatTampilan(baris.waktuMasukMentah),
    waktuKeluarIso: keFormatIso(baris.waktuKeluarMentah),
    waktuKeluar: formatTampilan(baris.waktuKeluarMentah),
  };
}

async function cariById(id) {
  const [baris] = await pool.query(
    `${QUERY_DASAR} WHERE p.id_pengunjung = ? GROUP BY p.id_pengunjung`,
    [id]
  );
  if (baris.length === 0) return null;
  return petakanBaris(baris[0]);
}

async function ambilSemua() {
  const [baris] = await pool.query(
    `${QUERY_DASAR} GROUP BY p.id_pengunjung ORDER BY p.waktu_masuk DESC`
  );
  return baris.map(petakanBaris);
}

async function buat({ namaTamu, unitKerja, keperluan }) {
  const id = await buatIdKunjungan(pool);

  const koneksi = await pool.getConnection();
  try {
    await koneksi.beginTransaction();
    await koneksi.query(
      `INSERT INTO pengunjung (id_pengunjung, unit_kerja_instansi, keperluan, status, waktu_masuk)
       VALUES (?, ?, ?, 'Menunggu Persetujuan', NOW())`,
      [id, unitKerja, keperluan]
    );
    for (const nama of namaTamu) {
      await koneksi.query(
        `INSERT INTO pengunjung_nama (id_pengunjung, nama) VALUES (?, ?)`,
        [id, nama]
      );
    }
    await koneksi.commit();
  } catch (err) {
    await koneksi.rollback();
    throw err;
  } finally {
    koneksi.release();
  }

  return cariById(id);
}

async function ubahStatus(id, status) {
  const [hasil] = await pool.query(
    `UPDATE pengunjung SET status = ? WHERE id_pengunjung = ?`,
    [status, id]
  );
  return hasil.affectedRows > 0;
}

async function ambilStatus(id) {
  const [baris] = await pool.query(
    `SELECT status FROM pengunjung WHERE id_pengunjung = ?`,
    [id]
  );
  return baris.length ? baris[0].status : null;
}

async function catatKeluar(id) {
  await pool.query(
    `UPDATE pengunjung SET status = 'Kunjungan Selesai', waktu_keluar = NOW()
     WHERE id_pengunjung = ?`,
    [id]
  );
}

module.exports = {
  cariById,
  ambilSemua,
  buat,
  ubahStatus,
  ambilStatus,
  catatKeluar,
};
