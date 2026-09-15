import { useState } from "react";

const ATURAN = [
  "Tidak diperkenankan masuk ruangan tanpa seijin petugas.",
  "Dilarang makan & minum selama berada di dalam ruangan.",
  "Dilarang merokok konvensional/elektrik di dalam ruangan.",
  "Dilarang mengambil gambar/video di dalam ruangan.",
  "Menjaga kebersihan ruangan selama digunakan.",
  "Tidak diperkenankan memindah/merubah peralatan yang ada di ruangan.",
  "Wajib mengisi form penggunaan ruangan sebelum meninggalkan ruangan.",
];

export default function PeraturanModal({ onSetuju }) {
  const [dicentang, setDicentang] = useState(false);

  return (
    <div className="modal-overlay">
      <div className="card modal-card peraturan-card">
        <div className="eyebrow" style={{ textAlign: "center" }}>
          Peraturan &amp; Tata Tertib
        </div>
        <h2 style={{ textAlign: "center" }}>
          Penggunaan Ruangan Jaringan &amp; Komunikasi
          <br />
          BBMKG Wilayah II
        </h2>

        <ol className="peraturan-list">
          {ATURAN.map((aturan, index) => (
            <li key={index}>{aturan}</li>
          ))}
        </ol>

        <label className="peraturan-checkbox">
          <input
            type="checkbox"
            checked={dicentang}
            onChange={(e) => setDicentang(e.target.checked)}
          />
          <span>
            Saya sudah membaca semua peraturan dan setuju dengan peraturan
            tersebut
          </span>
        </label>

        <button
          type="button"
          className="btn btn-primary"
          disabled={!dicentang}
          onClick={onSetuju}
        >
          Lanjutkan
        </button>
      </div>
    </div>
  );
}
