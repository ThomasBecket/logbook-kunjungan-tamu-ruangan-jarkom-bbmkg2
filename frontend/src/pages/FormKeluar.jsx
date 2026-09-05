import { useEffect, useState } from "react";
import SiteHeader from "../components/SiteHeader";
import { useToast } from "../context/ToastContext";
import {
  muatDataTamu,
  simpanDataTamu,
  waktuIsoSekarang,
  formatTanggal,
  ambilIdTerakhir,
  hapusIdTerakhir,
} from "../api/storage";

export default function FormKeluar() {
  const tampilkanToast = useToast();
  const [idKunjungan, setIdKunjungan] = useState("");
  const [hasil, setHasil] = useState(null); // { nama, waktu } setelah berhasil

  useEffect(() => {
    const idTerakhir = ambilIdTerakhir();
    if (idTerakhir) {
      setIdKunjungan(idTerakhir);
      tampilkanToast("Nomor kunjungan terakhir otomatis terisi.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function tanganiSubmit(e) {
    e.preventDefault();
    const id = idKunjungan.trim().toUpperCase();
    const daftarTamu = muatDataTamu();
    const index = daftarTamu.findIndex((v) => v.id === id);
    if (index === -1) {
      tampilkanToast("Nomor kunjungan tidak ditemukan.");
      return;
    }
    if (daftarTamu[index].status !== "Diterima") {
      tampilkanToast("Tamu belum memiliki akses masuk yang disetujui.");
      return;
    }
    const waktuKeluarIso = waktuIsoSekarang();
    daftarTamu[index].status = "Kunjungan Selesai";
    daftarTamu[index].waktuKeluarIso = waktuKeluarIso;
    daftarTamu[index].waktuKeluar = formatTanggal(waktuKeluarIso);
    simpanDataTamu(daftarTamu);
    hapusIdTerakhir();
    setHasil({
      nama: (daftarTamu[index].namaTamu || []).join(", "),
      waktu: daftarTamu[index].waktuKeluar,
    });
  }

  return (
    <>
      <SiteHeader badge="TAMU KELUAR" />
      <main>
        <section className="container narrow">
          <div className="eyebrow">QR Pintu Keluar</div>
          <h1>Tamu Keluar</h1>
          <p className="subtitle" style={{ marginLeft: 0 }}>
            Masukkan nomor kunjungan yang diperoleh saat melakukan pendaftaran
            masuk.
          </p>

          {!hasil && (
            <form className="card form-card" onSubmit={tanganiSubmit}>
              <div className="field">
                <label htmlFor="idKunjungan">Nomor Kunjungan</label>
                <input
                  id="idKunjungan"
                  required
                  placeholder="Contoh: T-ABC123"
                  value={idKunjungan}
                  onChange={(e) => setIdKunjungan(e.target.value)}
                />
              </div>
              <button className="btn btn-primary" type="submit">
                Konfirmasi Keluar
              </button>
            </form>
          )}

          {hasil && (
            <div className="card status-card">
              <div className="status-icon ok">✓</div>
              <div className="eyebrow">QR Pintu Keluar</div>
              <h2>Data Kepulangan Tercatat</h2>
              <p className="subtitle">
                Terima kasih atas kunjungan Anda. Data waktu keluar telah
                tersimpan.
              </p>
              <div className="status-box">
                Nama: <strong>{hasil.nama}</strong>
                <br />
                Waktu keluar: <strong>{hasil.waktu}</strong>
              </div>
              <button
                className="btn btn-success"
                onClick={() => window.location.reload()}
              >
                Selesai
              </button>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
