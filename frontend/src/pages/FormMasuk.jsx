import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useToast } from "../context/ToastContext";
import { kirimKunjungan, simpanIdTerakhir } from "../api/storage";

export default function FormMasuk() {
  useDocumentTitle("Tamu Masuk — BBMKG Wilayah II");
  const navigate = useNavigate();
  const tampilkanToast = useToast();

  const [namaTamu, setNamaTamu] = useState([""]);
  const [unitKerja, setUnitKerja] = useState("");
  const [keperluan, setKeperluan] = useState("");
  const [mengirim, setMengirim] = useState(false);

  function ubahNama(index, value) {
    setNamaTamu((prev) => prev.map((n, i) => (i === index ? value : n)));
  }

  function tambahKolomNama() {
    setNamaTamu((prev) => [...prev, ""]);
  }

  function hapusKolomNama(index) {
    setNamaTamu((prev) => prev.filter((_, i) => i !== index));
  }

  async function tanganiSubmit(e) {
    e.preventDefault();
    const namaBersih = namaTamu.map((n) => n.trim()).filter(Boolean);
    if (namaBersih.length === 0) {
      tampilkanToast("Isi minimal 1 nama tamu.");
      return;
    }

    setMengirim(true);
    try {
      const tamuBaru = await kirimKunjungan({
        namaTamu: namaBersih,
        unitKerja: unitKerja.trim(),
        keperluan: keperluan.trim(),
      });
      simpanIdTerakhir(tamuBaru.id);
      // Redirect ke halaman status miliknya sendiri, berdasarkan id_pengunjung.
      // Halaman ini juga jadi bookmark/link yang bisa dibuka ulang kapan saja
      // untuk cek status atau lanjut ke Form Keluar.
      navigate(`/status/${tamuBaru.id}`);
    } catch (err) {
      tampilkanToast(err.message);
    } finally {
      setMengirim(false);
    }
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
            <button className="btn btn-primary" type="submit" disabled={mengirim}>
              {mengirim ? "MENGIRIM..." : "KIRIM DATA"}
            </button>
          </form>
        </section>
      </main>
    </>
  );
}
