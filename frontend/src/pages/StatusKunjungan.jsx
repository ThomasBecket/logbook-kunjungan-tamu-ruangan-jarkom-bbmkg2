import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useToast } from "../context/ToastContext";
import { cekStatusKunjungan } from "../api/storage";

export default function StatusKunjungan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const tampilkanToast = useToast();

  const [tamu, setTamu] = useState(null);
  const [memuat, setMemuat] = useState(true);
  const [tidakDitemukan, setTidakDitemukan] = useState(false);
  const [tersalin, setTersalin] = useState(false);

  useDocumentTitle(`Kunjungan ${id} — BBMKG Wilayah II`);

  async function muatStatus() {
    setMemuat(true);
    try {
      const data = await cekStatusKunjungan(id);
      setTamu(data);
      setTidakDitemukan(false);
    } catch {
      setTidakDitemukan(true);
    } finally {
      setMemuat(false);
    }
  }

  useEffect(() => {
    muatStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function salinIdKunjungan() {
    navigator.clipboard.writeText(id).then(() => {
      tampilkanToast("Nomor kunjungan disalin.");
      setTersalin(true);
      setTimeout(() => setTersalin(false), 1500);
    });
  }

  return (
    <>
      <SiteHeader badge="STATUS KUNJUNGAN" />
      <main>
        <section className="container narrow">
          {memuat && (
            <div className="card status-card">
              <p className="subtitle">Memuat status kunjungan...</p>
            </div>
          )}

          {!memuat && tidakDitemukan && (
            <div className="card status-card">
              <div className="status-icon no">×</div>
              <div className="eyebrow">Tidak Ditemukan</div>
              <h2>Nomor Kunjungan Tidak Ditemukan</h2>
              <p className="subtitle">
                Periksa kembali link/nomor kunjungan Anda, atau daftar ulang
                lewat Form Masuk.
              </p>
              <button className="btn btn-secondary" onClick={() => navigate("/form-masuk")}>
                Ke Form Masuk
              </button>
            </div>
          )}

          {!memuat && tamu && tamu.status === "Menunggu Persetujuan" && (
            <div className="card status-card">
              <div className="status-icon wait">…</div>
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
                ⚠️ Simpan halaman ini (atau screenshot) — dibutuhkan untuk
                konfirmasi keluar.
              </p>
              <p className="subtitle">
                Status: <strong>Menunggu Konfirmasi</strong>
                <br />
                Silakan tunggu petugas menyetujui kunjungan Anda.
              </p>
              <button className="btn btn-secondary" onClick={muatStatus}>
                Cek Status
              </button>
            </div>
          )}

          {!memuat && tamu && tamu.status === "Diterima" && (
            <div className="card status-card">
              <div className="status-icon ok">✓</div>
              <div className="eyebrow">Akses Disetujui</div>
              <h2>Anda Telah Dikonfirmasi</h2>
              <p className="subtitle">
                Data kunjungan telah disetujui oleh petugas. Silakan memasuki
                ruangan. Setelah selesai, gunakan tombol di bawah untuk
                konfirmasi keluar.
              </p>
              <button className="btn btn-success" onClick={() => navigate("/form-keluar")}>
                Ke Form Keluar
              </button>
            </div>
          )}

          {!memuat && tamu && tamu.status === "Ditolak" && (
            <div className="card status-card">
              <div className="status-icon no">×</div>
              <div className="eyebrow">Akses Tidak Disetujui</div>
              <h2>Kunjungan Ditolak</h2>
              <p className="subtitle">
                Mohon mengikuti arahan petugas terkait kunjungan Anda.
              </p>
              <button className="btn btn-secondary" onClick={() => navigate("/form-masuk")}>
                Kembali ke Form Masuk
              </button>
            </div>
          )}

          {!memuat && tamu && tamu.status === "Kunjungan Selesai" && (
            <div className="card status-card">
              <div className="status-icon ok">✓</div>
              <div className="eyebrow">Kunjungan Selesai</div>
              <h2>Anda Sudah Tercatat Keluar</h2>
              <p className="subtitle">
                Terima kasih atas kunjungan Anda.
                <br />
                Waktu keluar: <strong>{tamu.waktuKeluar}</strong>
              </p>
              <button className="btn btn-secondary" onClick={() => navigate("/form-masuk")}>
                Ke Form Masuk
              </button>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
