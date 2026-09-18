// controllers/pengunjungController.js
// Layer Controller (huruf C di MVC): terima request, validasi input,
// panggil Model untuk urusan data, lalu kirim response. TIDAK ADA query SQL
// di sini — itu semua ada di models/pengunjungModel.js.

const PengunjungModel = require("../models/pengunjungModel");



// POST /api/pengunjung — tamu masuk submit data
async function tambahKunjungan(req, res) {
  try {
    const { namaTamu, unitKerja, keperluan } = req.body;

    const namaBersih = Array.isArray(namaTamu)
      ? namaTamu.map((n) => String(n).trim()).filter(Boolean)
      : [];
    if (namaBersih.length === 0) {
      return res.status(400).json({ error: "Isi minimal 1 nama tamu." });
    }
    if (!unitKerja || !String(unitKerja).trim()) {
      return res.status(400).json({ error: "Unit kerja/instansi wajib diisi." });
    }
    if (!keperluan || !String(keperluan).trim()) {
      return res.status(400).json({ error: "Keperluan wajib diisi." });
    }

    const kunjungan = await PengunjungModel.buat({
      namaTamu: namaBersih,
      unitKerja: unitKerja.trim(),
      keperluan: keperluan.trim(),
    });

    res.status(201).json(kunjungan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal menyimpan data kunjungan." });
  }
}



// GET /api/pengunjung — semua data
async function ambilSemuaKunjungan(req, res) {
  try {
    const daftar = await PengunjungModel.ambilSemua();
    res.json(daftar);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengambil data kunjungan." });
  }
}



// GET /api/pengunjung/:id — cek status 1 tamu
async function ambilKunjungan(req, res) {
  try {
    const kunjungan = await PengunjungModel.cariById(req.params.id);
    if (!kunjungan) {
      return res.status(404).json({ error: "Nomor kunjungan tidak ditemukan." });
    }
    res.json(kunjungan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengambil status." });
  }
}



// PATCH /api/pengunjung/:id/status — admin approve/reject (WAJIB sudah login)
async function ubahStatusKunjungan(req, res) {
  try {
    const { id } = req.params;
    const { status, alasanDitolak } = req.body;
    const { namaPetugas } = req.admin;

    if (!namaPetugas) {
      return res.status(401).json({
        error:
          "Sesi Anda tidak lengkap (kemungkinan sesi lama). Silakan logout dan login ulang.",
      });
    }

    const statusDiizinkan = ["Diterima", "Ditolak"];

    if (!statusDiizinkan.includes(status)) {
      return res.status(400).json({ error: "Status tidak valid." });
    }

    const alasanBersih =
      status === "Ditolak" && alasanDitolak != null
        ? String(alasanDitolak).trim() || null
        : null;

    const berhasil = await PengunjungModel.ubahStatus(
      id,
      status,
      namaPetugas,
      alasanBersih
    );

    if (!berhasil) {
      return res.status(404).json({
        error: "Nomor kunjungan tidak ditemukan.",
      });
    }

    const kunjungan = await PengunjungModel.cariById(id);

    res.json(kunjungan);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Gagal mengubah status.",
    });
  }
}



// POST /api/pengunjung/:id/keluar — konfirmasi tamu keluar
async function catatKunjunganKeluar(req, res) {
  try {
    const { id } = req.params;
    const statusSaatIni = await PengunjungModel.ambilStatus(id);

    if (statusSaatIni === null) {
      return res.status(404).json({ error: "Nomor kunjungan tidak ditemukan." });
    }
    if (statusSaatIni !== "Diterima") {
      return res
        .status(400)
        .json({ error: "Tamu belum memiliki akses masuk yang disetujui." });
    }

    await PengunjungModel.catatKeluar(id);
    const kunjungan = await PengunjungModel.cariById(id);
    res.json(kunjungan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mencatat kepulangan." });
  }
}

module.exports = {
  tambahKunjungan,
  ambilSemuaKunjungan,
  ambilKunjungan,
  ubahStatusKunjungan,
  catatKunjunganKeluar,
};
