export default function TolakKunjunganModal({
  kunjungan,
  alasanDitolak,
  setAlasanDitolak,
  mengirim,
  onClose,
  onConfirm,
}) {
  if (!kunjungan) return null;

  return (
    <div
      className="modal-overlay modal-overlay-konfirmasi"
      onClick={() => !mengirim && onClose()}
    >
      <div
        className="card modal-card modal-alasan-ditolak"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Tolak Kunjungan</h2>

        <p className="konfirmasi-text">
          Masukkan alasan penolakan untuk kunjungan berikut. Alasan boleh
          dikosongkan.
        </p>

        <div className="konfirmasi-data">
          <div className="konfirmasi-item">
            <span>Nomor Kunjungan</span>
            <strong>{kunjungan.id}</strong>
          </div>

          <div className="konfirmasi-item">
            <span>Nama Tamu</span>
            <strong>{kunjungan.namaTamu?.join(", ")}</strong>
          </div>
        </div>

        <div className="field">
          <label htmlFor="alasanDitolak">Alasan Ditolak</label>

          <textarea
            id="alasanDitolak"
            value={alasanDitolak}
            onChange={(e) => setAlasanDitolak(e.target.value)}
            placeholder="Contoh: Data kunjungan tidak lengkap."
            disabled={mengirim}
          />
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={mengirim}
          >
            Batal
          </button>

          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={mengirim}
          >
            {mengirim ? "MENYIMPAN..." : "Ya, Tolak"}
          </button>
        </div>
      </div>
    </div>
  );
}