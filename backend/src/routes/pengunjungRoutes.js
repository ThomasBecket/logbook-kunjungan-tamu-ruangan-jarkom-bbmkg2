// routes/pengunjung.js
const express = require("express");
const router = express.Router();
const pengunjungController = require("../controllers/pengunjungController");

router.post("/", pengunjungController.tambahKunjungan);
router.get("/", pengunjungController.ambilSemuaKunjungan);
router.get("/:id", pengunjungController.ambilKunjungan);
router.patch("/:id/status", pengunjungController.ubahStatusKunjungan);
router.post("/:id/keluar", pengunjungController.catatKunjunganKeluar);

module.exports = router;
