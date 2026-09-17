export default function KonfirmasiHapusAdminModal({
  admin,
  menghapus,
  onClose,
  onConfirm,
}) {
  if (!admin) return null;

  return (
    <div
      className="modal-overlay modal-overlay-konfirmasi"
      onClick={() => !menghapus && onClose()}
    >
      <div
        className="card modal-card modal-konfirmasi"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Konfirmasi Hapus Akses</h2>

        <p className="konfirmasi-text">
          Apakah kamu yakin ingin menghapus akses admin berikut?
        </p>

        <div className="konfirmasi-data">
          <div className="konfirmasi-item">
            <span>ID Admin</span>
            <strong>{admin.id}</strong>
          </div>

          <div className="konfirmasi-item">
            <span>Nama Petugas</span>
            <strong>{admin.nama}</strong>
          </div>
        </div>

        <p className="konfirmasi-peringatan">
          Setelah akses dihapus, akun tersebut tidak dapat lagi digunakan
          untuk masuk ke panel admin.
        </p>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={menghapus}
          >
            Batal
          </button>

          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={menghapus}
          >
            {menghapus ? "MENGHAPUS..." : "Ya, Hapus Akses"}
          </button>
        </div>
      </div>
    </div>
  );
}

