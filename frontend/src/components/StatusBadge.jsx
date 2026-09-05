const PETA_STATUS = {
  "Menunggu Persetujuan": ["wait", "Menunggu"],
  Diterima: ["ok", "Disetujui"],
  Ditolak: ["no", "Ditolak"],
  "Kunjungan Selesai": ["ok", "Sudah Keluar"],
};

export default function StatusBadge({ status }) {
  const [kelas, label] = PETA_STATUS[status] || ["wait", status];
  return <span className={`badge ${kelas}`}>{label}</span>;
}
