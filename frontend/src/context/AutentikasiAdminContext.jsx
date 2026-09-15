import { createContext, useContext, useEffect, useState } from "react";
import api, { KUNCI_TOKEN } from "../api/client";

const KUNCI_ADMIN = "bbmkg_admin";
const AutentikasiAdminContext = createContext(null);

export function AutentikasiProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const tersimpan = localStorage.getItem(KUNCI_ADMIN);
    return tersimpan ? JSON.parse(tersimpan) : null;
  });
  // Selama true, kita belum tahu pasti sesi ini valid atau tidak —
  // ProteksiRute harus menunggu ini selesai sebelum memutuskan
  // redirect ke /login atau tidak.
  const [memuatSesi, setMemuatSesi] = useState(true);

  // Setiap kali aplikasi dimuat/di-refresh, verifikasi ulang ke server
  // apakah token yang tersimpan MASIH valid — bukan cuma percaya data
  // localStorage begitu saja. Ini yang memperbaiki kasus "server di-restart
  // tapi masih bisa akses halaman admin".
  useEffect(() => {
    async function verifikasiSesi() {
      const token = localStorage.getItem(KUNCI_TOKEN);
      if (!token) {
        setAdmin(null);
        setMemuatSesi(false);
        return;
      }
      try {
        const res = await api.get("/admin/saya");
        setAdmin(res.data);
        localStorage.setItem(KUNCI_ADMIN, JSON.stringify(res.data));
      } catch {
        // Token tidak valid, sudah expired, atau server tidak bisa dihubungi
        // sama sekali — dianggap tidak login, paksa ke halaman login lagi.
        localStorage.removeItem(KUNCI_TOKEN);
        localStorage.removeItem(KUNCI_ADMIN);
        setAdmin(null);
      } finally {
        setMemuatSesi(false);
      }
    }
    verifikasiSesi();
  }, []);

  async function login(username, password) {
    const res = await api.post("/admin/login", { username, password });
    const { token, admin: dataAdmin } = res.data;
    localStorage.setItem(KUNCI_TOKEN, token);
    localStorage.setItem(KUNCI_ADMIN, JSON.stringify(dataAdmin));
    setAdmin(dataAdmin);
    return dataAdmin;
  }

  function logout() {
    localStorage.removeItem(KUNCI_TOKEN);
    localStorage.removeItem(KUNCI_ADMIN);
    setAdmin(null);
  }

  return (
    <AutentikasiAdminContext.Provider
      value={{ admin, login, logout, sudahLogin: !!admin, memuatSesi }}
    >
      {children}
    </AutentikasiAdminContext.Provider>
  );
}

export function useAutentikasiAdmin() {
  const ctx = useContext(AutentikasiAdminContext);
  if (!ctx) {
    throw new Error("useAutentikasiAdmin harus dipakai di dalam <AutentikasiProvider>");
  }
  return ctx;
}
