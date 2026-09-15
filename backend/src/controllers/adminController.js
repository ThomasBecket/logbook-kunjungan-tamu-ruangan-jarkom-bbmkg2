// controllers/adminController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AdminModel = require("../models/adminModel");

// POST /api/adminApi/login — login, kembalikan JWT token
async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username dan password wajib diisi." });
    }

    const admin = await AdminModel.cariByUsername(username.trim());
    if (!admin) {
      return res.status(401).json({ error: "Username atau password salah." });
    }

    if (admin.status === "Menunggu Persetujuan") {
      return res
        .status(403)
        .json({ error: "Akun Anda masih menunggu persetujuan admin utama." });
    }
    if (admin.status === "Ditolak") {
      return res.status(403).json({ error: "Pendaftaran akun Anda ditolak." });
    }

    const cocok = await bcrypt.compare(password, admin.password);
    if (!cocok) {
      return res.status(401).json({ error: "Username atau password salah." });
    }

    const payload = {
      id: admin.id_admin,
      username: admin.username,
      namaPetugas: admin.nama_petugas,
      role: admin.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "8h" });

    res.json({ token, admin: payload });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal login." });
  }
}

// POST /api/adminApi/daftar — ajukan akun admin baru (WAJIB sudah login,
// tapi akun baru ini statusnya "Menunggu Persetujuan" — belum bisa
// dipakai login sampai disetujui admin utama)
async function daftarAdmin(req, res) {
  try {
    const { username, password, namaPetugas } = req.body;

    if (!username || !String(username).trim()) {
      return res.status(400).json({ error: "Username wajib diisi." });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: "Password minimal 6 karakter." });
    }
    if (!namaPetugas || !String(namaPetugas).trim()) {
      return res.status(400).json({ error: "Nama petugas wajib diisi." });
    }

    const usernameBersih = username.trim();

    const sudahAda = await AdminModel.cariByUsername(usernameBersih);
    if (sudahAda) {
      return res.status(409).json({ error: "Username sudah dipakai, pilih username lain." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await AdminModel.buat({
      username: usernameBersih,
      passwordHash,
      namaPetugas: namaPetugas.trim(),
    });

    res.status(201).json(admin);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mendaftarkan admin." });
  }
}

// GET /api/adminApi/menunggu — daftar admin yang menunggu persetujuan
// (HANYA admin utama)
async function ambilAdminMenunggu(req, res) {
  try {
    const daftar = await AdminModel.cariSemuaMenunggu();
    res.json(daftar);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengambil data." });
  }
}

// PATCH /api/adminApi/:id/status — setujui/tolak admin baru (HANYA admin utama)
async function ubahStatusAdmin(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const statusDiizinkan = ["Diterima", "Ditolak"];
    if (!statusDiizinkan.includes(status)) {
      return res.status(400).json({ error: "Status tidak valid." });
    }

    const berhasil = await AdminModel.ubahStatusAdmin(id, status);
    if (!berhasil) {
      return res.status(404).json({ error: "Admin tidak ditemukan." });
    }

    res.json({ message: `Admin ${id} berhasil di-${status.toLowerCase()}.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengubah status admin." });
  }
}

// PATCH /api/adminApi/ganti-password — ganti password (WAJIB sudah login)
async function gantiPassword(req, res) {
  try {
    const { passwordLama, passwordBaru } = req.body;
    const { username } = req.admin;

    if (!passwordBaru || passwordBaru.length < 6) {
      return res.status(400).json({ error: "Password baru minimal 6 karakter." });
    }

    const admin = await AdminModel.cariByUsername(username);
    if (!admin) {
      return res.status(404).json({ error: "Akun tidak ditemukan." });
    }

    const cocok = await bcrypt.compare(passwordLama || "", admin.password);
    if (!cocok) {
      return res.status(401).json({ error: "Password lama salah." });
    }

    const passwordHashBaru = await bcrypt.hash(passwordBaru, 10);
    await AdminModel.updatePassword(username, passwordHashBaru);

    res.json({ message: "Password berhasil diganti." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengganti password." });
  }
}

// GET /api/adminApi/saya — verifikasi sesi + ambil data admin TERBARU dari
// database (bukan cuma dari isi token lama). Dipanggil frontend setiap kali
// halaman admin dibuka/di-refresh, supaya token basi atau server yang
// baru restart tidak dianggap "masih login" begitu saja.
async function ambilSaya(req, res) {
  try {
    const admin = await AdminModel.cariByUsername(req.admin.username);
    if (!admin || admin.status !== "Diterima") {
      return res.status(401).json({ error: "Sesi tidak valid, silakan login ulang." });
    }
    res.json({
      id: admin.id_admin,
      username: admin.username,
      namaPetugas: admin.nama_petugas,
      role: admin.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal memverifikasi sesi." });
  }
}

module.exports = {
  login,
  daftarAdmin,
  ambilAdminMenunggu,
  ubahStatusAdmin,
  gantiPassword,
  ambilSaya,
};
