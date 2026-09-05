import { useState } from "react";
import { useToast } from "../context/ToastContext";

export default function GantiPasswordModal({ onClose }) {
  const tampilkanToast = useToast();
  const [passwordLama, setPasswordLama] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");

  function tanganiSubmit(e) {
    e.preventDefault();
    if (passwordBaru.length < 6) {
      tampilkanToast("Password baru minimal 6 karakter.");
      return;
    }
    if (passwordBaru !== konfirmasiPassword) {
      tampilkanToast("Konfirmasi password tidak cocok.");
      return;
    }
    // TODO: ganti dengan panggilan ke backend, misal:
    // await axios.post("/api/admin/ganti-password", { passwordLama, passwordBaru })
    // Backend yang verifikasi passwordLama & hash passwordBaru sebelum simpan.
    tampilkanToast("Password berhasil diganti (demo, belum tersambung backend).");
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="card modal-card" onClick={(e) => e.stopPropagation()}>
        <h2>Ganti Password</h2>
        <form onSubmit={tanganiSubmit}>
          <div className="field">
            <label htmlFor="passwordLama">Password Lama</label>
            <input
              id="passwordLama"
              type="password"
              required
              value={passwordLama}
              onChange={(e) => setPasswordLama(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="passwordBaru">Password Baru</label>
            <input
              id="passwordBaru"
              type="password"
              required
              value={passwordBaru}
              onChange={(e) => setPasswordBaru(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="konfirmasiPassword">Konfirmasi Password Baru</label>
            <input
              id="konfirmasiPassword"
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
            <button type="submit" className="btn btn-primary" style={{ width: "auto" }}>
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
