import { useEffect, useMemo, useState } from "react";
import { useToast } from "../context/ToastContext";
import { useAutentikasiAdmin } from "../context/AutentikasiAdminContext";
import { muatDataTamu, ubahStatusKunjungan } from "../api/storage";
import socket from "../api/frontendSocket";
import StatusBadge from "../components/StatusBadge";
import DetailKunjunganModal from "../components/DetailKunjunganModal";
import TolakKunjunganModal from "../components/TolakKunjunganModal";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function AdminTamuMenunggu() {
  useDocumentTitle("Tamu Menunggu — BBMKG Wilayah II");
  const tampilkanToast = useToast();
  const { admin } = useAutentikasiAdmin();
  const adalahUtama = admin?.role === "utama";
  const [daftarTamu, setDaftarTamu] = useState([]);
  const [memuat, setMemuat] = useState(true);
  const [gagalMemuat, setGagalMemuat] = useState(false);
  const [kunjunganDetail, setKunjunganDetail] = useState(null);
  const [kunjunganYangDitolak, setKunjunganYangDitolak] = useState(null);
  const [alasanDitolak, setAlasanDitolak] = useState("");
  const [mengirimPenolakan, setMengirimPenolakan] = useState(false);

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

    function tanganiPerubahan() {
      muatUlang();
    }

    socket.on("kunjungan:baru", tanganiPerubahan);
    socket.on("kunjungan:diubah", tanganiPerubahan);

    return () => {
      socket.off("kunjungan:baru", tanganiPerubahan);
      socket.off("kunjungan:diubah", tanganiPerubahan);
    };

  }, []);


  
  const jumlahMenunggu = useMemo(
    () => daftarTamu.filter((v) => v.status === "Menunggu Persetujuan").length,
    [daftarTamu]
  );


  
  const jumlahDiDalam = useMemo(
    () => daftarTamu.filter((v) => v.status === "Diterima").length,
    [daftarTamu]
  );



  const kunciHariIni = useMemo(
    () => new Date().toISOString().slice(0, 10),
    []
  );



  const tamuMenungguHariIni = useMemo(
    () =>
      daftarTamu.filter(
        (v) =>
          v.waktuMasukIso &&
          v.waktuMasukIso.slice(0, 10) === kunciHariIni
      ),
    [daftarTamu, kunciHariIni]
  );



  const tamuMenungguSebelumnya = useMemo(
    () =>
      daftarTamu.filter(
        (v) =>
          v.status === "Menunggu Persetujuan" &&
          v.waktuMasukIso &&
          v.waktuMasukIso.slice(0, 10) < kunciHariIni
      ),
    [daftarTamu, kunciHariIni]
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

  function bukaModalTolak(kunjungan) {
    setKunjunganYangDitolak(kunjungan);
    setAlasanDitolak("");
  }

  function tutupModalTolak() {
    if (mengirimPenolakan) return;
    setKunjunganYangDitolak(null);
    setAlasanDitolak("");
  }

  async function konfirmasiTolak() {
    if (!kunjunganYangDitolak) return;

    setMengirimPenolakan(true);

    try {
      await ubahStatusKunjungan(
        kunjunganYangDitolak.id,
        "Ditolak",
        alasanDitolak
      );
      tampilkanToast("Tamu Ditolak.");
      setKunjunganYangDitolak(null);
      setAlasanDitolak("");
      await muatUlang();
    } catch (err) {
      tampilkanToast(err.message);
    } finally {
      setMengirimPenolakan(false);
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
          ) : (
            <>
              <section className="pending-section">
                <div className="pending-section-header">
                  <div className="pending-section-title">
                    <h2>Tamu Menunggu Hari Ini</h2>
                    <p>
                      Menampilkan kunjungan hari ini yang masih menunggu persetujuan.
                    </p>
                  </div>
                  <span className="pending-section-count">
                    {tamuMenungguHariIni.length} Tamu
                  </span>
                </div>

                <div className="pending-section-body">
                  {tamuMenungguHariIni.length ? (
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
                      {tamuMenungguHariIni.map((v, index) => (
                        <tr key={v.id} onClick={() => setKunjunganDetail(v)} style={{ cursor: "pointer" }}>
                          <td className="col-no">{index + 1}</td>
                          <td className="col-id">{v.id}</td>
                          <td>{(v.namaTamu || []).join(", ")}</td>
                          <td>{v.unitKerja}</td>
                          <td>{v.keperluan}</td>
                          <td>{v.waktuMasuk}</td>
                          <td>{v.namaPetugasVerifikasi || "-"}</td>
                          <td onClick={(e) => e.stopPropagation()}>
                            {v.status === "Menunggu Persetujuan" && !adalahUtama ? (
                              <div className="status-cell">
                                <button
                                  className="btn btn-danger btn-small"
                                  onClick={() => bukaModalTolak(v)}
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
                    <div className="pending-section-empty">
                      Tidak ada tamu yang menunggu konfirmasi hari ini.
                    </div>
                  )}
                </div>
              </section>

              <section className="pending-section">
                <div className="pending-section-header">
                  <div className="pending-section-title">
                    <h2>Pending dari Hari Sebelumnya</h2>
                    <p>
                      Menampilkan kunjungan dari tanggal sebelumnya yang masih berstatus Menunggu Persetujuan.
                    </p>
                  </div>
                  <span className="pending-section-count">
                    {tamuMenungguSebelumnya.length} Tamu
                  </span>
                </div>

                <div className="pending-section-body">
                  {tamuMenungguSebelumnya.length ? (
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
                      {tamuMenungguSebelumnya.map((v, index) => (
                        <tr key={v.id} onClick={() => setKunjunganDetail(v)} style={{ cursor: "pointer" }}>
                          <td className="col-no">{index + 1}</td>
                          <td className="col-id">{v.id}</td>
                          <td>{(v.namaTamu || []).join(", ")}</td>
                          <td>{v.unitKerja}</td>
                          <td>{v.keperluan}</td>
                          <td>{v.waktuMasuk}</td>
                          <td>{v.namaPetugasVerifikasi || "-"}</td>
                          <td onClick={(e) => e.stopPropagation()}>
                            {v.status === "Menunggu Persetujuan" && !adalahUtama ? (
                              <div className="status-cell">
                                <button
                                  className="btn btn-danger btn-small"
                                  onClick={() => bukaModalTolak(v)}
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
                    <div className="pending-section-empty">
                      Tidak ada pending dari hari sebelumnya.
                    </div>
                  )}
                </div>
              </section>
            </>
          )}
        </>
      )}

      <DetailKunjunganModal
        kunjungan={kunjunganDetail}
        onClose={() => setKunjunganDetail(null)}
      />

      <TolakKunjunganModal
        kunjungan={kunjunganYangDitolak}
        alasanDitolak={alasanDitolak}
        setAlasanDitolak={setAlasanDitolak}
        mengirim={mengirimPenolakan}
        onClose={tutupModalTolak}
        onConfirm={konfirmasiTolak}
      />
    </section>
  );
}