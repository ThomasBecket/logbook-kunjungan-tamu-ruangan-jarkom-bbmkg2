// routes/adminRoute.js
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { verifikasiToken, hanyaUtama } = require("../middleware/autentikasi");

// Publik — belum login
router.post("/login", adminController.login);

// Wajib sudah login (siapa saja boleh mengajukan admin baru)
router.get("/saya", verifikasiToken, adminController.ambilSaya);
router.post("/daftar", verifikasiToken, adminController.daftarAdmin);
router.patch("/ganti-password", verifikasiToken, adminController.gantiPassword);

// Wajib sudah login DAN role "utama"
router.get("/menunggu", verifikasiToken, hanyaUtama, adminController.ambilAdminMenunggu);
router.patch("/:id/status", verifikasiToken, hanyaUtama, adminController.ubahStatusAdmin);

module.exports = router;
