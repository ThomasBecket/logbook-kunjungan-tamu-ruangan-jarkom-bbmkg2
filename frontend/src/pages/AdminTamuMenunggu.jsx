import { useEffect, useMemo, useState } from "react";
import { useToast } from "../context/ToastContext";
import { muatDataTamu, simpanDataTamu } from "../api/storage";
import StatusBadge from "../components/StatusBadge";

export default function AdminTamuMenunggu() {
  const tampilkanToast = useToast();
  const [daftarTamu, setDaftarTamu] = useState([]);

  useEffect(() => {
    setDaftarTamu(muatDataTamu());
  }, []);

  const jumlahMenunggu = useMemo(
    () => daftarTamu.filter((v) => v.status === "Menunggu Persetujuan").length,
    [daftarTamu]
  );
  const jumlahDiDalam = useMemo(
    () => daftarTamu.filter((v) => v.status === "Diterima").length,
    [daftarTamu]
  );

  function ubahStatus(id, status) {
    const diperbarui = muatDataTamu().map((v) =>
      v.id === id ? { ...v, status } : v
    );
    simpanDataTamu(diperbarui);
    setDaftarTamu(diperbarui);
    tampilkanToast(status === "Diterima" ? "Tamu dikonfirmasi." : "Tamu ditolak.");
  }

  return (
    <section className="dashboard">
      <div className="dashboard-top">
        <div>
          <div className="eyebrow">Panel Petugas</div>
          <h1 style={{ textAlign: "left" }}>Tamu Menunggu Konfirmasi</h1>
          <p className="subtitle" style={{ marginLeft: 0, textAlign: "left" }}>
            Periksa data pengunjung sebelum memberikan akses masuk.
          </p>
        </div>
      </div>

      <div className="stats">
        <div className="card stat">
          <span>Menunggu Konfirmasi</span>
          <strong>{jumlahMenunggu}</strong>
        </div>
        <div className="card stat">
          <span>Sedang Di Dalam</span>
          <strong>{jumlahDiDalam}</strong>
        </div>
        <div className="card stat">
          <span>Total Data</span>
          <strong>{daftarTamu.length}</strong>
        </div>
      </div>

      {daftarTamu.length ? (
        <div className="visitor-list">
          {daftarTamu.map((v) => (
            <div className="card visitor-row" key={v.id}>
              <div className="vinfo">
                <strong>{(v.namaTamu || []).join(", ")}</strong>
                <small>
                  {v.unitKerja} • {v.keperluan}
                </small>
              </div>
              <div className="vtime">{v.waktuMasuk}</div>
              <div className="vactions">
                {v.status === "Menunggu Persetujuan" ? (
                  <>
                    <button
                      className="btn btn-danger btn-small"
                      onClick={() => ubahStatus(v.id, "Ditolak")}
                    >
                      Tolak
                    </button>
                    <button
                      className="btn btn-primary btn-small"
                      style={{ width: "auto" }}
                      onClick={() => ubahStatus(v.id, "Diterima")}
                    >
                      Konfirmasi
                    </button>
                  </>
                ) : (
                  <StatusBadge status={v.status} />
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card empty">Belum ada data kunjungan.</div>
      )}
    </section>
  );
}
