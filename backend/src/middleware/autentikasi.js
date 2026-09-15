// middleware/autentikasi.js
// Melindungi endpoint yang cuma boleh diakses admin yang sudah login.
// Cek header "Authorization: Bearer <token>", verifikasi dengan JWT_SECRET,
// lalu tempelkan data admin (id, username, namaPetugas) ke req.admin
// supaya controller berikutnya bisa langsung pakai tanpa perlu tanya lagi.

const jwt = require("jsonwebtoken");

function verifikasiToken(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Anda harus login terlebih dahulu." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = payload; // { id, username, namaPetugas }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Sesi habis atau tidak valid, silakan login lagi." });
  }
}

function hanyaUtama(req, res, next) {
  if (req.admin?.role !== "utama") {
    return res.status(403).json({ error: "Hanya admin utama yang berwenang untuk ini." });
  }
  next();
}

function tolakUtama(req, res, next) {
  if (req.admin?.role === "utama") {
    return res
      .status(403)
      .json({ error: "Admin utama tidak berwenang memverifikasi kunjungan tamu." });
  }
  next();
}

module.exports = { verifikasiToken, hanyaUtama, tolakUtama };

