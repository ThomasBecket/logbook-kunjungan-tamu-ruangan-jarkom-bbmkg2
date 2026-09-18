import StatusBadge from "./StatusBadge";

export default function DetailKunjunganModal({ kunjungan, onClose,}) {
    
  if (!kunjungan) return null;

  const ditolak = kunjungan.status === "Ditolak";

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className="card modal-card modal-detail-kunjungan"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-detail-header">
          <div>
            <div className="eyebrow">Detail Kunjungan</div>
            <h2>{kunjungan.id}</h2>
          </div>

          <StatusBadge status={kunjungan.status} />
        </div>

        <div className="detail-data">
          <div className="detail-item">
            <span>Nama Tamu</span>
            <strong>
              {kunjungan.namaTamu?.length
                ? kunjungan.namaTamu.join(", ")
                : "-"}
            </strong>
          </div>

          <div className="detail-item">
            <span>Unit Kerja / Instansi</span>
            <strong>{kunjungan.unitKerja || "-"}</strong>
          </div>

          <div className="detail-item detail-item-column">
            <span>Keperluan</span>
            <strong>{kunjungan.keperluan || "-"}</strong>
          </div>

          <div className="detail-item">
            <span>Waktu Masuk</span>
            <strong>{kunjungan.waktuMasuk || "-"}</strong>
          </div>

          <div className="detail-item">
            <span>Waktu Keluar</span>
            <strong>{kunjungan.waktuKeluar || "-"}</strong>
          </div>

          <div className="detail-item">
            <span>Petugas Verifikasi</span>
            <strong>
              {kunjungan.namaPetugasVerifikasi || "-"}
            </strong>
          </div>

          {ditolak && (
            <div className="detail-item detail-item-column detail-alasan-ditolak">
              <span>Alasan Ditolak</span>
              <strong>
                {kunjungan.alasanDitolak || "Tidak ada alasan yang diberikan."}
              </strong>
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}