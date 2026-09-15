import axios from "axios";

const KUNCI_TOKEN = "bbmkg_token";

// baseURL relatif "/api" — dikombinasikan dengan proxy di vite.config.js
// yang meneruskan /api ke http://localhost:3001. Ini menghindari masalah
// CORS saat development, dan kalau nanti deploy tinggal proxy-nya diarahkan
// ke domain backend produksi, kode di sini tidak perlu diubah.
const api = axios.create({
  baseURL: "/api",
});

// Sebelum tiap request dikirim, tempelkan token JWT (kalau ada) ke header
// Authorization — jadi setiap pemanggil axios tidak perlu urus ini manual.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(KUNCI_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Kalau server balas 401 (token tidak valid/sudah habis), otomatis hapus
// token lama dan lempar ke halaman login — supaya user tidak nyangkut di
// halaman admin dengan sesi yang sudah mati.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(KUNCI_TOKEN);
      localStorage.removeItem("bbmkg_admin");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
export { KUNCI_TOKEN };
