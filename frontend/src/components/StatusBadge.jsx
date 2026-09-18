const PETA_STATUS = {
  "Menunggu Persetujuan": ["tunggu", "Menunggu"],
  Diterima: ["disetujui", "Disetujui"],
  Ditolak: ["ditolak", "Ditolak"],
  "Kunjungan Selesai": ["selesai", "Sudah Keluar"],
};

export default function StatusBadge({ status }) {
  const [kelas, label] = PETA_STATUS[status] || ["wait", status];
  return <span className={`badge ${kelas}`}>{label}</span>;
}
