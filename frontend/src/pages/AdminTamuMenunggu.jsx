import { useEffect, useMemo, useState } from "react";
import { useToast } from "../context/ToastContext";
import { useAutentikasiAdmin } from "../context/AutentikasiAdminContext";
import { muatDataTamu, ubahStatusKunjungan } from "../api/storage";
import StatusBadge from "../components/StatusBadge";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function AdminTamuMenunggu() {
  useDocumentTitle("Tamu Menunggu — BBMKG Wilayah II");
  const tampilkanToast = useToast();
  const { admin } = useAutentikasiAdmin();
  const adalahUtama = admin?.role === "utama";
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
      // Nama petugas yang memverifikasi otomatis diambil backend dari
      // token JWT (siapa yang sedang login) — tidak perlu diketik manual.
      await ubahStatusKunjungan(id, status);
      tampilkanToast(status === "Diterima" ? "Tamu Dikonfirmasi." : "Tamu Ditolak.");
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
            {adalahUtama
              ? "Anda login sebagai admin utama — halaman ini hanya bisa dilihat, bukan untuk memverifikasi kunjungan."
              : "Periksa data pengunjung sebelum memberikan akses masuk."}
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
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>ID Kunjungan</th>
                    <th>Nama Tamu</th>
                    <th>Unit Kerja / Instansi</th>
                    <th>Keperluan</th>
                    <th>Waktu Masuk</th>
                    <th>Diverifikasi Oleh</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {daftarTamu.map((v, index) => (
                    <tr key={v.id}>
                      <td className="col-no">{index + 1}</td>
                      <td className="col-id">{v.id}</td>
                      <td>{(v.namaTamu || []).join(", ")}</td>
                      <td>{v.unitKerja}</td>
                      <td>{v.keperluan}</td>
                      <td>{v.waktuMasuk}</td>
                      <td>{v.namaPetugasVerifikasi || "-"}</td>
                      <td>
                        {v.status === "Menunggu Persetujuan" && !adalahUtama ? (
                          <div className="status-cell">
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
                          </div>
                        ) : (
                          <StatusBadge status={v.status} />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="card empty">Belum ada data kunjungan.</div>
          )}
        </>
      )}
    </section>
  );
}
