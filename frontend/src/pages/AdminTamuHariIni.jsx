import { useEffect, useMemo, useState } from "react";
import { muatDataTamu } from "../api/storage";
import socket from "../api/frontendSocket";
import StatusBadge from "../components/StatusBadge";
import DetailKunjunganModal from "../components/DetailKunjunganModal";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function AdminTamuHariIni() {
  useDocumentTitle("Tamu Hari Ini — BBMKG Wilayah II");
  const [daftarTamu, setDaftarTamu] = useState([]);
  const [kunjunganDetail, setKunjunganDetail] = useState(null);

  useEffect(() => {
    async function muatUlang() {
      const data = await muatDataTamu();
      setDaftarTamu(data);
    }

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
                <th>Waktu Keluar</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tamuHariIni.map((v, index) => (
                <tr key={v.id} onClick={() => setKunjunganDetail(v)} style={{ cursor: "pointer" }}>
                  <td className="col-no">{index + 1}</td>
                  <td className="col-id">{v.id}</td>
                  <td>{(v.namaTamu || []).join(", ")}</td>
                  <td>{v.unitKerja}</td>
                  <td>{v.keperluan}</td>
                  <td>{v.waktuMasuk}</td>
                  <td>{v.waktuKeluar || "-"}</td>
                  <td>
                    <StatusBadge status={v.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card empty">Belum ada tamu hari ini.</div>
      )}

      <DetailKunjunganModal
        kunjungan={kunjunganDetail}
        onClose={() => setKunjunganDetail(null)}
      />
    </section>
  );
}
