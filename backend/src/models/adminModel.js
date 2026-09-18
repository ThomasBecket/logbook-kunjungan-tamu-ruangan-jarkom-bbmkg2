// models/adminModel.js
const pool = require("../database");

async function cariByUsername(username) {
  const [baris] = await pool.query(
    `SELECT id_admin, username, password, nama_petugas, role FROM admin WHERE username = ?`,
    [username]
  );
  return baris.length ? baris[0] : null;
}

async function updatePassword(username, passwordHashBaru) {
  const [hasil] = await pool.query(
    `UPDATE admin SET password = ? WHERE username = ?`,
    [passwordHashBaru, username]
  );
  return hasil.affectedRows > 0;
}



// Cari id_admin 3 digit terkecil yang belum dipakai — kalau 002 pernah
// dihapus, admin baru berikutnya akan dapat "002" lagi, bukan lompat ke 004.
async function cariIdBerikutnya() {
  const [baris] = await pool.query(`SELECT id_admin FROM admin ORDER BY id_admin ASC`);
  const idTerpakai = new Set(baris.map((b) => b.id_admin));
  let n = 1;
  while (idTerpakai.has(String(n).padStart(3, "0"))) {
    n++;
  }
  return String(n).padStart(3, "0");
}



// Admin baru hanya dibuat oleh admin utama dan langsung mendapatkan role
// "petugas" tanpa melalui proses pendaftaran atau persetujuan.
async function buat({ username, passwordHash, namaPetugas }) {
  // Retry beberapa kali kalau ID kebetulan bentrok (jarang terjadi,
  // cuma jaga-jaga kalau ada 2 admin dibuat nyaris bersamaan).
  for (let percobaan = 0; percobaan < 5; percobaan++) {
    const id = await cariIdBerikutnya();
    try {
      await pool.query(
        `INSERT INTO admin (id_admin, username, password, nama_petugas, role)
         VALUES (?, ?, ?, ?, 'petugas')`,
        [id, username, passwordHash, namaPetugas]
      );
      return { id, username, namaPetugas, role: "petugas" };
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") continue; // coba id berikutnya
      throw err;
    }
  }
  throw new Error("Gagal generate id_admin, coba lagi.");
}



// Mengambil seluruh data admin untuk ditampilkan oleh admin utama.
async function cariSemuaAdmin() {
  const [baris] = await pool.query(
    `SELECT id_admin, username, nama_petugas, role
     FROM admin
     ORDER BY id_admin ASC`
  );
  return baris;
}



// Menghapus akun admin berdasarkan id_admin.
async function hapusAdmin(id) {
  const [hasil] = await pool.query(
    `DELETE FROM admin WHERE id_admin = ?`,
    [id]
  );
  return hasil.affectedRows > 0;
}

module.exports = {
  cariByUsername,
  buat,
  updatePassword,
  cariSemuaAdmin,
  hapusAdmin,
};