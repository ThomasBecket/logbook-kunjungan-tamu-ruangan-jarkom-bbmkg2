// api/admin.js

import api from "./client";

function pesanError(err, default_) {
  return err?.response?.data?.error || default_;
}

// POST /api/admin/tambah — buat akun admin baru
export async function tambahAdmin({ username, password, namaPetugas }) {
  try {
    const res = await api.post("/admin/tambah", {
      username,
      password,
      namaPetugas,
    });
    return res.data;
  } catch (err) {
    throw new Error(pesanError(err, "Gagal menambahkan admin."));
  }
}

// GET /api/admin/semua — daftar seluruh admin
// (HANYA admin utama)
export async function ambilSemuaAdmin() {
  try {
    const res = await api.get("/admin/semua");
    return res.data;
  } catch (err) {
    throw new Error(pesanError(err, "Gagal mengambil data admin."));
  }
}

// DELETE /api/admin/:id — hapus akses admin
// (HANYA admin utama)
export async function hapusAdmin(id) {
  try {
    const res = await api.delete(`/admin/${id}`);
    return res.data;
  } catch (err) {
    throw new Error(pesanError(err, "Gagal menghapus admin."));
  }
}

// PATCH /api/admin/ganti-password — ganti password admin yang sedang login
export async function gantiPassword({ passwordLama, passwordBaru }) {
  try {
    const res = await api.patch("/admin/ganti-password", {
      passwordLama,
      passwordBaru,
    });
    return res.data;
  } catch (err) {
    throw new Error(pesanError(err, "Gagal mengganti password."));
  }
}