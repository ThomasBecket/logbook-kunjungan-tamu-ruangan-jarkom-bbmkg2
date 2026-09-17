// routes/adminRoute.js

const express = require("express");

const router = express.Router();

const adminController = require("../controllers/adminController");

const { verifikasiToken, hanyaUtama } = require("../middleware/autentikasi");

// Untuk akses fungsi login
router.post("/login", adminController.login);

// Untuk akses fungsi data admin dan perubahan password setelah login (Wajib sudah login)
router.get("/saya", verifikasiToken, adminController.ambilSaya);
router.patch("/ganti-password", verifikasiToken, adminController.gantiPassword);

// Untuk akses fungsi pengelolaan admin yang hanya dapat dilakukan oleh Admin Utama (Wajib sudah login sebagai Admin Utama)
router.get("/semua", verifikasiToken, hanyaUtama, adminController.ambilSemuaAdmin);
router.post("/tambah", verifikasiToken, hanyaUtama, adminController.tambahAdmin);
router.delete("/:id", verifikasiToken, hanyaUtama, adminController.hapusAdmin);

module.exports = router;