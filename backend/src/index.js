// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routerPengunjung = require("./routes/pengunjungRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Endpoint test sederhana — pakai ini dulu untuk pastikan server jalan
// sebelum coba endpoint yang perlu database.
app.get("/api/ping", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/pengunjung", routerPengunjung);

// Fallback kalau ada route yang tidak dikenali
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint tidak ditemukan." });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
