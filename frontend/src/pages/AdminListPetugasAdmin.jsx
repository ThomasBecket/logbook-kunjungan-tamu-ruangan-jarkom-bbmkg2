import { useEffect, useState } from "react";
import { useToast } from "../context/ToastContext";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { ambilSemuaAdmin, hapusAdmin } from "../api/admin";
import TambahAdminModal from "../components/TambahAdminModal";
import KonfirmasiHapusAdminModal from "../components/KonfirmasiHapusAdminModal";

export default function AdminListPetugasAdmin() {
  useDocumentTitle("List Petugas Admin — BBMKG Wilayah II");
  const tampilkanToast = useToast();

  const [daftarAdmin, setDaftarAdmin] = useState([]);
  const [memuat, setMemuat] = useState(true);
  const [pesanGagal, setPesanGagal] = useState("");
  const [tampilkanModal, setTampilkanModal] = useState(false);
  const [adminYangDihapus, setAdminYangDihapus] = useState(null);
  const [menghapus, setMenghapus] = useState(false);

  async function muatUlang() {
    try {
      const data = await ambilSemuaAdmin();
      setDaftarAdmin(data);
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

  function tanganiHapus(id, nama) {
    setAdminYangDihapus({
      id,
      nama,
      });
    }

  async function konfirmasiHapus() {
  if (!adminYangDihapus) return;

  setMenghapus(true);

    try {
      await hapusAdmin(adminYangDihapus.id);
      tampilkanToast("Akses admin berhasil dihapus.");
      setAdminYangDihapus(null);
      await muatUlang();
    } catch (err) {
      tampilkanToast(err.message);
    } finally {
      setMenghapus(false);
    }
  }

  return (
    <section className="dashboard">
      <div className="dashboard-top">
        <div>
          <div className="eyebrow">Panel Petugas</div>
          <h1 style={{ textAlign: "left" }}>List Petugas Admin</h1>
          <p className="subtitle" style={{ marginLeft: 0, textAlign: "left" }}>
            Kelola akun petugas yang punya akses ke panel admin ini.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-small btn-tambah-admin"
          style={{ width: "auto" }}
          onClick={() => setTampilkanModal(true)}
        >
          Tambah Admin
        </button>
      </div>

      {pesanGagal && <div className="card empty">{pesanGagal}</div>}

      {!pesanGagal &&
        (memuat ? (
          <div className="card empty">Memuat data...</div>
        ) : daftarAdmin.length ? (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID Admin</th>
                  <th>Nama Admin</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {daftarAdmin.map((a) => (
                  <tr key={a.id_admin}>
                    <td className="col-id">{a.id_admin}</td>
                    <td>{a.nama_petugas}</td>
                    <td>
                      {a.role === "utama" ? (
                        <span className="badge ok">Admin Utama</span>
                      ) : (
                        <button
                          className="btn btn-danger btn-small"
                          onClick={() => tanganiHapus(a.id_admin, a.nama_petugas)}
                        >
                          Hapus Akses
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card empty">Belum ada data admin.</div>
        ))}

      {tampilkanModal && (
        <TambahAdminModal
          onClose={() => setTampilkanModal(false)}
          onBerhasil={muatUlang}
        />
      )}

      <KonfirmasiHapusAdminModal
      admin={adminYangDihapus}
      menghapus={menghapus}
      onClose={() => setAdminYangDihapus(null)}
      onConfirm={konfirmasiHapus}
      />

    </section>
  );
}