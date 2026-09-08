import { useEffect, useState } from "react";
import SiteHeader from "../components/SiteHeader";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useToast } from "../context/ToastContext";
import {
  catatKunjunganKeluar,
  ambilIdTerakhir,
  hapusIdTerakhir,
} from "../api/storage";

export default function FormKeluar() {
  useDocumentTitle("Tamu Keluar — BBMKG Wilayah II");
  const tampilkanToast = useToast();
  const [idKunjungan, setIdKunjungan] = useState("");
  const [hasil, setHasil] = useState(null); // { nama, waktu } setelah berhasil
  const [mengirim, setMengirim] = useState(false);

  useEffect(() => {
    const idTerakhir = ambilIdTerakhir();
    if (idTerakhir) {
      setIdKunjungan(idTerakhir);
      tampilkanToast("Nomor kunjungan terakhir otomatis terisi.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function tanganiSubmit(e) {
    e.preventDefault();
    const id = idKunjungan.trim().toUpperCase();

    setMengirim(true);
    try {
      const kunjungan = await catatKunjunganKeluar(id);
      hapusIdTerakhir();
      setHasil({
        nama: (kunjungan.namaTamu || []).join(", "),
        waktu: kunjungan.waktuKeluar,
      });
    } catch (err) {
      tampilkanToast(err.message);
    } finally {
      setMengirim(false);
    }
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
                  placeholder="Contoh: 05092026-004"
                  value={idKunjungan}
                  onChange={(e) => setIdKunjungan(e.target.value)}
                />
              </div>
              <button className="btn btn-primary" type="submit" disabled={mengirim}>
                {mengirim ? "MEMPROSES..." : "KONFIRMASI KELUAR"}
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
