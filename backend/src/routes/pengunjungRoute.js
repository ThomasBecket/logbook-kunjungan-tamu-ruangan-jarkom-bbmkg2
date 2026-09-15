// routes/pengunjungRoute.js
const express = require("express");
const router = express.Router();
const pengunjungController = require("../controllers/pengunjungController");
const { verifikasiToken, tolakUtama } = require("../middleware/autentikasi");

// Publik — dipakai tamu, tidak perlu login
router.post("/", pengunjungController.tambahKunjungan);
router.get("/:id", pengunjungController.ambilKunjungan);
router.post("/:id/keluar", pengunjungController.catatKunjunganKeluar);

// Wajib sudah login — dipakai admin/petugas
router.get("/", verifikasiToken, pengunjungController.ambilSemuaKunjungan);
router.patch(
  "/:id/status",
  verifikasiToken,
  tolakUtama,
  pengunjungController.ubahStatusKunjungan
);

module.exports = router;
