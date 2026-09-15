import api from "./client";

function pesanError(err, default_) {
  return err?.response?.data?.error || default_;
}

// POST /api/adminApi/daftar — buat akun admin baru
export async function daftarAdmin({ username, password, namaPetugas }) {
  try {
    const res = await api.post("/adminApi/daftar", { username, password, namaPetugas });
    return res.data;
  } catch (err) {
    throw new Error(pesanError(err, "Gagal mendaftarkan admin."));
  }
}

// PATCH /api/adminApi/ganti-password — ganti password admin yang sedang login
export async function gantiPassword({ passwordLama, passwordBaru }) {
  try {
    const res = await api.patch("/adminApi/ganti-password", {
      passwordLama,
      passwordBaru,
    });
    return res.data;
  } catch (err) {
    throw new Error(pesanError(err, "Gagal mengganti password."));
  }
}

// GET /api/adminApi/menunggu — daftar admin yang menunggu persetujuan
// (HANYA admin utama)
export async function ambilAdminMenunggu() {
  try {
    const res = await api.get("/adminApi/menunggu");
    return res.data;
  } catch (err) {
    throw new Error(pesanError(err, "Gagal mengambil data admin menunggu."));
  }
}

// PATCH /api/adminApi/:id/status — setujui/tolak admin baru (HANYA admin utama)
export async function ubahStatusAdmin(id, status) {
  try {
    const res = await api.patch(`/adminApi/${id}/status`, { status });
    return res.data;
  } catch (err) {
    throw new Error(pesanError(err, "Gagal mengubah status admin."));
  }
}
