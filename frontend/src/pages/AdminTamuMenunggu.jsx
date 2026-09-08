import { useEffect, useMemo, useState } from "react";
import { useToast } from "../context/ToastContext";
import { muatDataTamu, ubahStatusKunjungan } from "../api/storage";
import StatusBadge from "../components/StatusBadge";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function AdminTamuMenunggu() {
  useDocumentTitle("Tamu Menunggu — BBMKG Wilayah II");
  const tampilkanToast = useToast();
  const [daftarTamu, setDaftarTamu] = useState([]);
  const [memuat, setMemuat] = useState(true);
  const [gagalMemuat, setGagalMemuat] = useState(false);

  async function muatUlang() {
    try {
      const data = await muatDataTamu();
      setDaftarTamu(data);
      setGagalMemuat(false);
    } catch {
      setGagalMemuat(true);
    } finally {
      setMemuat(false);
    }
  }

  useEffect(() => {
    muatUlang();
  }, []);

  const jumlahMenunggu = useMemo(
    () => daftarTamu.filter((v) => v.status === "Menunggu Persetujuan").length,
    [daftarTamu]
  );
  const jumlahDiDalam = useMemo(
    () => daftarTamu.filter((v) => v.status === "Diterima").length,
    [daftarTamu]
  );

  async function ubahStatus(id, status) {
    try {
      await ubahStatusKunjungan(id, status);
      tampilkanToast(status === "Diterima" ? "Tamu dikonfirmasi." : "Tamu ditolak.");
      muatUlang();
    } catch (err) {
      tampilkanToast(err.message);
    }
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

      {gagalMemuat && (
        <div className="card empty">
          Gagal memuat data. Pastikan server backend sedang berjalan.
        </div>
      )}

      {!gagalMemuat && (
        <>
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

          {memuat ? (
            <div className="card empty">Memuat data...</div>
          ) : daftarTamu.length ? (
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
        </>
      )}
    </section>
  );
}
