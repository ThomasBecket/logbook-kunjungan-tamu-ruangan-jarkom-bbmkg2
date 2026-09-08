import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { muatDataTamu } from "../api/storage";
import useDocumentTitle from "../hooks/useDocumentTitle";

const WARNA_STATUS = {
  "Menunggu Persetujuan": "#d9820f",
  Diterima: "#1f9d55",
  Ditolak: "#d9362b",
  "Kunjungan Selesai": "#1c63d9",
};

function ambilData7HariTerakhir(daftarTamu) {
  const hasil = [];
  for (let i = 6; i >= 0; i--) {
    const tanggal = new Date();
    tanggal.setDate(tanggal.getDate() - i);
    const kunciTanggal = tanggal.toISOString().slice(0, 10);
    const label = tanggal.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
    });
    const jumlah = daftarTamu.filter(
      (v) => v.waktuMasukIso && v.waktuMasukIso.slice(0, 10) === kunciTanggal
    ).length;
    hasil.push({ tanggal: label, jumlah });
  }
  return hasil;
}

export default function AdminDashboard() {
  useDocumentTitle("Dashboard Admin — Ruangan Jarkom BBMKG Wilayah II");
  const [daftarTamu, setDaftarTamu] = useState([]);

  useEffect(() => {
    muatDataTamu()
      .then(setDaftarTamu)
      .catch(() => setDaftarTamu([]));
  }, []);

  const dataChart = useMemo(() => ambilData7HariTerakhir(daftarTamu), [daftarTamu]);

  const dataStatus = useMemo(() => {
    const jumlah = {
      "Menunggu Persetujuan": 0,
      Diterima: 0,
      Ditolak: 0,
      "Kunjungan Selesai": 0,
    };
    daftarTamu.forEach((v) => {
      if (jumlah[v.status] !== undefined) jumlah[v.status] += 1;
    });
    return Object.entries(jumlah)
      .map(([name, value]) => ({ name, value }))
      .filter((d) => d.value > 0);
  }, [daftarTamu]);

  const totalHariIni = useMemo(() => {
    const kunciHariIni = new Date().toISOString().slice(0, 10);
    return daftarTamu.filter(
      (v) => v.waktuMasukIso && v.waktuMasukIso.slice(0, 10) === kunciHariIni
    ).length;
  }, [daftarTamu]);

  return (
    <section className="dashboard">
      <div className="dashboard-top">
        <div>
          <div className="eyebrow">Panel Petugas</div>
          <h1 style={{ textAlign: "left" }}>Dashboard</h1>
          <p className="subtitle" style={{ marginLeft: 0, textAlign: "left" }}>
            Ringkasan aktivitas kunjungan buku tamu.
          </p>
        </div>
      </div>

      <div className="stats">
        <div className="card stat">
          <span>Total Kunjungan</span>
          <strong>{daftarTamu.length}</strong>
        </div>
        <div className="card stat">
          <span>Kunjungan Hari Ini</span>
          <strong>{totalHariIni}</strong>
        </div>
        <div className="card stat">
          <span>Menunggu Konfirmasi</span>
          <strong>
            {daftarTamu.filter((v) => v.status === "Menunggu Persetujuan").length}
          </strong>
        </div>
      </div>

      <div className="chart-grid">
        <div className="card chart-card">
          <h2>Kunjungan 7 Hari Terakhir</h2>
          {daftarTamu.length === 0 ? (
            <div className="empty">Belum ada data kunjungan.</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={dataChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e9f2" />
                <XAxis dataKey="tanggal" fontSize={12} />
                <YAxis allowDecimals={false} fontSize={12} />
                <Tooltip />
                <Bar dataKey="jumlah" fill="#1c4e94" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card chart-card">
          <h2>Komposisi Status</h2>
          {dataStatus.length === 0 ? (
            <div className="empty">Belum ada data kunjungan.</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={dataStatus}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {dataStatus.map((entry) => (
                    <Cell key={entry.name} fill={WARNA_STATUS[entry.name]} />
                  ))}
                </Pie>
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  wrapperStyle={{ fontSize: 12 }}
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </section>
  );
}
