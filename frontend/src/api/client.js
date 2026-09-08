import axios from "axios";

// baseURL relatif "/api" — dikombinasikan dengan proxy di vite.config.js
// yang meneruskan /api ke http://localhost:3001. Ini menghindari masalah
// CORS saat development, dan kalau nanti deploy tinggal proxy-nya diarahkan
// ke domain backend produksi, kode di sini tidak perlu diubah.
const api = axios.create({
  baseURL: "/api",
});

export default api;
