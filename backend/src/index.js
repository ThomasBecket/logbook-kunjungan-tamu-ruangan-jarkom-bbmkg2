// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { pasangSocketIO } = require("./utils/backendSocket");
const routerPengunjung = require("./routes/pengunjungRoute");
const routerAdmin = require("./routes/adminRoute");

const app = express();
const server = http.createServer(app);

pasangSocketIO(server);

app.use(cors());
app.use(express.json());

// Endpoint test sederhana — pakai ini dulu untuk pastikan server jalan
// sebelum coba endpoint yang perlu database.
app.get("/api/ping", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/pengunjung", routerPengunjung);
app.use("/api/admin", routerAdmin);

// Fallback kalau ada route yang tidak dikenali
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint tidak ditemukan." });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
