import { useState } from "react";
import SiteHeader from "../components/SiteHeader";
import { useToast } from "../context/ToastContext";
import {
  muatDataTamu,
  simpanDataTamu,
  buatIdKunjungan,
  waktuIsoSekarang,
  formatTanggal,
  simpanIdTerakhir,
} from "../api/storage";

export default function FormMasuk() {
  const tampilkanToast = useToast();
  const [namaTamu, setNamaTamu] = useState([""]);
  const [unitKerja, setUnitKerja] = useState("");
  const [keperluan, setKeperluan] = useState("");
  const [tamu, setTamu] = useState(null);
  const [tampilan, setTampilan] = useState("form"); // form | menunggu | diterima | ditolak
  const [tersalin, setTersalin] = useState(false);

  function ubahNama(index, value) {
    setNamaTamu((prev) => prev.map((n, i) => (i === index ? value : n)));
  }

  function tambahKolomNama() {
    setNamaTamu((prev) => [...prev, ""]);
  }

  function hapusKolomNama(index) {
    setNamaTamu((prev) => prev.filter((_, i) => i !== index));
  }

  function tanganiSubmit(e) {
    e.preventDefault();
    const namaBersih = namaTamu.map((n) => n.trim()).filter(Boolean);
    if (namaBersih.length === 0) {
      tampilkanToast("Isi minimal 1 nama tamu.");
      return;
    }
    const waktuMasukIso = waktuIsoSekarang();
    const tamuBaru = {
      id: buatIdKunjungan(),
      namaTamu: namaBersih,
      unitKerja: unitKerja.trim(),
      keperluan: keperluan.trim(),
      status: "Menunggu Persetujuan",
      waktuMasukIso,
      waktuMasuk: formatTanggal(waktuMasukIso),
      waktuKeluarIso: null,
      waktuKeluar: null,
    };
    const daftarTamu = muatDataTamu();
    daftarTamu.unshift(tamuBaru);
    simpanDataTamu(daftarTamu);
    simpanIdTerakhir(tamuBaru.id);
    setTamu(tamuBaru);
    setTampilan("menunggu");
  }

  function salinIdKunjungan() {
    if (!tamu) return;
    navigator.clipboard.writeText(tamu.id).then(() => {
      tampilkanToast("Nomor kunjungan disalin.");
      setTersalin(true);
      setTimeout(() => setTersalin(false), 1500);
    });
  }

  function cekStatus() {
    if (!tamu) return;
    const sekarang = muatDataTamu().find((v) => v.id === tamu.id);
    if (!sekarang) return;
    if (sekarang.status === "Diterima") {
      setTampilan("diterima");
    } else if (sekarang.status === "Ditolak") {
      setTampilan("ditolak");
    } else {
      tampilkanToast("Masih menunggu konfirmasi petugas.");
    }
  }

  function resetFormulir() {
    setNamaTamu([""]);
    setUnitKerja("");
    setKeperluan("");
    setTamu(null);
    setTampilan("form");
  }

  return (
    <>
      <SiteHeader badge="TAMU MASUK" />
      <main>
        <section className="container narrow">
          <div className="eyebrow">QR Pintu Masuk</div>
          <h1>Tamu Masuk</h1>
          <p className="subtitle" style={{ marginLeft: 0 }}>
            Lengkapi data kunjungan. Setelah dikirim, Anda harus menunggu
            konfirmasi petugas sebelum memasuki ruangan.
          </p>

          {tampilan === "form" && (
            <form className="card form-card" onSubmit={tanganiSubmit}>
              <div className="field">
                <label>Nama Tamu</label>
                <div id="namesContainer">
                  {namaTamu.map((nama, index) => (
                    <div className="name-row" key={index}>
                      <input
                        className="guest-name-input"
                        required={index === 0}
                        placeholder="Masukkan nama lengkap"
                        value={nama}
                        onChange={(e) => ubahNama(index, e.target.value)}
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          className="btn-remove-name"
                          onClick={() => hapusKolomNama(index)}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button type="button" className="btn-add-name" onClick={tambahKolomNama}>
                  + Tambah Nama (jika rombongan)
                </button>
              </div>
              <div className="field">
                <label htmlFor="unitKerja">Unit Kerja / Instansi</label>
                <input
                  id="unitKerja"
                  required
                  placeholder="Masukkan unit kerja / instansi"
                  value={unitKerja}
                  onChange={(e) => setUnitKerja(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="keperluan">Keperluan</label>
                <textarea
                  id="keperluan"
                  required
                  placeholder="Tuliskan keperluan kunjungan"
                  value={keperluan}
                  onChange={(e) => setKeperluan(e.target.value)}
                />
              </div>
              <button className="btn btn-primary" type="submit">
                Kirim Data
              </button>
            </form>
          )}

          {tampilan === "menunggu" && tamu && (
            <div className="card status-card">
              <div className="status-icon ok">✓</div>
              <div className="eyebrow">Pendaftaran Berhasil</div>
              <h2>Nomor Kunjungan</h2>
              <div className="visitor-code">{tamu.id}</div>
              <button
                type="button"
                className={`btn-copy${tersalin ? " copied" : ""}`}
                onClick={salinIdKunjungan}
              >
                {tersalin ? "Tersalin ✓" : "Salin Nomor"}
              </button>
              <p className="reminder">
                ⚠️ Simpan/screenshot nomor ini — dibutuhkan untuk konfirmasi keluar.
              </p>
              <p className="subtitle">
                Status: <strong>Menunggu Konfirmasi</strong>
                <br />
                Silakan tunggu petugas menyetujui kunjungan Anda.
              </p>
              <button className="btn btn-secondary" onClick={cekStatus}>
                Cek Status
              </button>
            </div>
          )}

          {tampilan === "diterima" && (
            <div className="card status-card">
              <div className="status-icon ok">✓</div>
              <div className="eyebrow">Akses Disetujui</div>
              <h2>Anda Telah Dikonfirmasi</h2>
              <p className="subtitle">
                Data kunjungan telah disetujui oleh petugas. Silakan memasuki
                ruangan.
              </p>
              <button className="btn btn-success" onClick={resetFormulir}>
                Selesai
              </button>
            </div>
          )}

          {tampilan === "ditolak" && (
            <div className="card status-card">
              <div className="status-icon no">×</div>
              <div className="eyebrow">Akses Tidak Disetujui</div>
              <h2>Kunjungan Ditolak</h2>
              <p className="subtitle">
                Mohon mengikuti arahan petugas terkait kunjungan Anda.
              </p>
              <button className="btn btn-secondary" onClick={resetFormulir}>
                Selesai
              </button>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
