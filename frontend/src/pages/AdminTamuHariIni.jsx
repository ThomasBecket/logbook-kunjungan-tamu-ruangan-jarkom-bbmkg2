import { useEffect, useMemo, useState } from "react";
import { muatDataTamu } from "../api/storage";
import StatusBadge from "../components/StatusBadge";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function AdminTamuHariIni() {
  useDocumentTitle("List Tamu Hari Ini — Ruangan Jarkom BBMKG Wilayah II");
  const [daftarTamu, setDaftarTamu] = useState([]);

  useEffect(() => {
    muatDataTamu()
      .then(setDaftarTamu)
      .catch(() => setDaftarTamu([]));
  }, []);

  const labelHariIni = useMemo(
    () =>
      new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    []
  );

  const tamuHariIni = useMemo(() => {
    const kunciHariIni = new Date().toISOString().slice(0, 10);
    return daftarTamu.filter(
      (v) => v.waktuMasukIso && v.waktuMasukIso.slice(0, 10) === kunciHariIni
    );
  }, [daftarTamu]);

  return (
    <section className="dashboard">
      <div className="dashboard-top">
        <div>
          <div className="eyebrow">Panel Petugas</div>
          <h1 style={{ textAlign: "left" }}>Tamu Hari Ini</h1>
          <p className="subtitle" style={{ marginLeft: 0, textAlign: "left" }}>
            {labelHariIni} — {tamuHariIni.length} kunjungan
          </p>
        </div>
      </div>

      {tamuHariIni.length ? (
        <div className="visitor-list">
          {tamuHariIni.map((v) => (
            <div className="card visitor-row" key={v.id}>
              <div className="vinfo">
                <strong>{(v.namaTamu || []).join(", ")}</strong>
                <small>
                  {v.unitKerja} • {v.keperluan}
                </small>
              </div>
              <div className="vtime">{v.waktuMasuk}</div>
              <div className="vactions">
                <StatusBadge status={v.status} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card empty">Belum ada tamu hari ini.</div>
      )}
    </section>
  );
}
