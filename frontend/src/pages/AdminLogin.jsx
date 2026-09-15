import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAutentikasiAdmin } from "../context/AutentikasiAdminContext";
import { useToast } from "../context/ToastContext";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function AdminLogin() {
  useDocumentTitle("Login Petugas — BBMKG Wilayah II");
  const { login } = useAutentikasiAdmin();
  const navigate = useNavigate();
  const tampilkanToast = useToast();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mengirim, setMengirim] = useState(false);

  async function tanganiSubmit(e) {
    e.preventDefault();
    setMengirim(true);
    try {
      await login(username.trim(), password);
      navigate("/admin");
    } catch (err) {
      tampilkanToast(err?.response?.data?.error || "Username atau password salah.");
    } finally {
      setMengirim(false);
    }
  }

  return (
    <main>
      <section className="container narrow">
        <div className="eyebrow">Panel Petugas</div>
        <h1>Login</h1>
        <p className="subtitle" style={{ marginLeft: 0 }}>
          Masuk menggunakan akun petugas untuk mengakses panel admin.
        </p>

        <form className="card form-card" onSubmit={tanganiSubmit}>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              required
              autoFocus
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" type="submit" disabled={mengirim}>
            {mengirim ? "MEMPROSES..." : "LOGIN"}
          </button>
        </form>
      </section>
    </main>
  );
}
