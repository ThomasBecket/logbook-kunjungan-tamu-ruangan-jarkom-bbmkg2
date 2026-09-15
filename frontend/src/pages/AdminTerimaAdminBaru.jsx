import { useEffect, useState } from "react";
import { useToast } from "../context/ToastContext";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { ambilAdminMenunggu, ubahStatusAdmin } from "../api/adminApi";

export default function AdminTerimaAdminBaru() {
  useDocumentTitle("Terima Admin Baru — BBMKG Wilayah II");
  const tampilkanToast = useToast();

  const [daftarMenunggu, setDaftarMenunggu] = useState([]);
  const [memuat, setMemuat] = useState(true);
  const [pesanGagal, setPesanGagal] = useState("");

  async function muatUlang() {
    try {
      const data = await ambilAdminMenunggu();
      setDaftarMenunggu(data);
      setPesanGagal("");
    } catch (err) {
      setPesanGagal(err.message);
    } finally {
      setMemuat(false);
    }
  }

  useEffect(() => {
    muatUlang();
  }, []);

  async function tanganiUbahStatus(id, status) {
    try {
      await ubahStatusAdmin(id, status);
      tampilkanToast(
        status === "Diterima" ? "Admin baru disetujui." : "Pendaftaran admin ditolak."
      );
      muatUlang();
    } catch (err) {
      tampilkanToast(err.message);
    }
  }

  return (
    <section className="dashboard">
      <div className="dashboard-top">
        <div>
          <div className="eyebrow">Panel Petugas</div>
          <h1 style={{ textAlign: "left" }}>Terima Admin Baru</h1>
          <p className="subtitle" style={{ marginLeft: 0, textAlign: "left" }}>
            Setujui atau tolak pendaftaran akun admin baru sebelum mereka bisa
            login.
          </p>
        </div>
      </div>

      {pesanGagal && (
        <div className="card empty">{pesanGagal}</div>
      )}

      {!pesanGagal &&
        (memuat ? (
          <div className="card empty">Memuat data...</div>
        ) : daftarMenunggu.length ? (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID Admin</th>
                  <th>Nama Petugas</th>
                  <th>Username</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {daftarMenunggu.map((a) => (
                  <tr key={a.id_admin}>
                    <td className="col-id">{a.id_admin}</td>
                    <td>{a.nama_petugas}</td>
                    <td>{a.username}</td>
                    <td>
                      <div className="aksi-cell">
                        <button
                          className="btn btn-danger btn-small"
                          onClick={() => tanganiUbahStatus(a.id_admin, "Ditolak")}
                        >
                          Tolak
                        </button>
                        <button
                          className="btn btn-primary btn-small"
                          style={{ width: "auto" }}
                          onClick={() => tanganiUbahStatus(a.id_admin, "Diterima")}
                        >
                          Setujui
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card empty">Tidak ada pendaftaran admin yang menunggu.</div>
        ))}
    </section>
  );
}
