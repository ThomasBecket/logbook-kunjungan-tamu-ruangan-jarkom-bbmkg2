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
  const [tampilkanKonfirmasi, setTampilkanKonfirmasi] = useState(false);

  function tanganiSubmit(e) {
    e.preventDefault();

    if (password.length < 6) {
      tampilkanToast("Password minimal 6 karakter.");
      return;
    }

    if (password !== konfirmasiPassword) {
      tampilkanToast("Konfirmasi password tidak cocok.");
      return;
    }

    setTampilkanKonfirmasi(true);
  }

  async function konfirmasiTambah() {
    setMengirim(true);

    try {
      await tambahAdmin({
        username: username.trim(),
        password,
        namaPetugas: namaPetugas.trim(),
      });

      tampilkanToast("Admin baru berhasil ditambahkan.");
      setTampilkanKonfirmasi(false);
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
        <h2>Tambah Admin Petugas</h2>

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
            <label htmlFor="konfirmasiPasswordBaruAdmin">
              Konfirmasi Password
            </label>
            <input
              id="konfirmasiPasswordBaruAdmin"
              type="password"
              required
              value={konfirmasiPassword}
              onChange={(e) => setKonfirmasiPassword(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Batal
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "auto" }}
              disabled={mengirim}
            >
              Tambah
            </button>
          </div>
        </form>
        
        {tampilkanKonfirmasi && (
          <div
            className="modal-overlay modal-overlay-konfirmasi"
            onClick={() => !mengirim && setTampilkanKonfirmasi(false)}
          >
            <div
              className="card modal-card modal-konfirmasi"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Konfirmasi Tambah Admin Petugas</h2>

              <p className="konfirmasi-text">
                Pastikan data admin baru berikut sudah benar sebelum ditambahkan.
              </p>

              <div className="konfirmasi-data">
                <div className="konfirmasi-item">
                  <span>Nama Petugas</span>
                  <strong>{namaPetugas.trim()}</strong>
                </div>

                <div className="konfirmasi-item">
                  <span>Username</span>
                  <strong>{username.trim()}</strong>
                </div>

                <div className="konfirmasi-item">
                  <span>Role</span>
                  <strong>Petugas</strong>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setTampilkanKonfirmasi(false)}
                  disabled={mengirim}
                >
                  Batal
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ width: "auto" }}
                  onClick={konfirmasiTambah}
                  disabled={mengirim}
                >
                  {mengirim ? "MENAMBAHKAN..." : "Ya, Tambahkan"}
                </button>
              </div>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}

