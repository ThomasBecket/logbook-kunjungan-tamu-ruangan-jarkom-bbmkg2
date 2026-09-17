import { useState } from "react";
import { useToast } from "../context/ToastContext";
import { tambahAdmin } from "../api/admin";

export default function TambahAdminModal({ onClose, onBerhasil }) {
  const tampilkanToast = useToast();
  const [namaPetugas, setNamaPetugas] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");
  const [mengirim, setMengirim] = useState(false);

  async function tanganiSubmit(e) {
    e.preventDefault();
    if (password.length < 6) {
      tampilkanToast("Password minimal 6 karakter.");
      return;
    }
    if (password !== konfirmasiPassword) {
      tampilkanToast("Konfirmasi password tidak cocok.");
      return;
    }

    setMengirim(true);
    try {
      await tambahAdmin({
        username: username.trim(),
        password,
        namaPetugas: namaPetugas.trim(),
      });
      tampilkanToast("Admin baru berhasil ditambahkan.");
      onBerhasil();
      onClose();
    } catch (err) {
      tampilkanToast(err.message);
    } finally {
      setMengirim(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="card modal-card" onClick={(e) => e.stopPropagation()}>
        <h2>Tambah Admin</h2>
        <form onSubmit={tanganiSubmit}>
          <div className="field">
            <label htmlFor="namaPetugasBaru">Nama Petugas</label>
            <input
              id="namaPetugasBaru"
              required
              placeholder="Masukkan nama lengkap"
              value={namaPetugas}
              onChange={(e) => setNamaPetugas(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="usernameBaru">Username</label>
            <input
              id="usernameBaru"
              required
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="passwordBaruAdmin">Password</label>
            <input
              id="passwordBaruAdmin"
              type="password"
              required
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="konfirmasiPasswordBaruAdmin">Konfirmasi Password</label>
            <input
              id="konfirmasiPasswordBaruAdmin"
              type="password"
              required
              value={konfirmasiPassword}
              onChange={(e) => setKonfirmasiPassword(e.target.value)}
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "auto" }}
              disabled={mengirim}
            >
              {mengirim ? "MENYIMPAN..." : "Tambah"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
