import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import GantiPasswordModal from "./GantiPasswordModal";

export default function ProfileMenu() {
  const [menuTerbuka, setMenuTerbuka] = useState(false);
  const [tampilkanModal, setTampilkanModal] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const tampilkanToast = useToast();

  useEffect(() => {
    function tanganiKlikDiLuar(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuTerbuka(false);
      }
    }
    document.addEventListener("mousedown", tanganiKlikDiLuar);
    return () => document.removeEventListener("mousedown", tanganiKlikDiLuar);
  }, []);

  function tanganiLogout() {
    setMenuTerbuka(false);
    // TODO: setelah backend auth siap, hapus token/session di sini
    // (misal: localStorage.removeItem("token")) sebelum redirect.
    tampilkanToast("Anda telah logout.");
    navigate("/form-masuk");
  }

  return (
    <div className="sidebar-profile" ref={menuRef}>
      {menuTerbuka && (
        <div className="profile-menu">
          <button
            type="button"
            className="profile-menu-item"
            onClick={() => {
              setTampilkanModal(true);
              setMenuTerbuka(false);
            }}
          >
            Ganti Password
          </button>
          <button
            type="button"
            className="profile-menu-item danger"
            onClick={tanganiLogout}
          >
            Logout
          </button>
        </div>
      )}
      <button
        type="button"
        className="profile-trigger"
        onClick={() => setMenuTerbuka((v) => !v)}
      >
        <div className="profile-avatar">P</div>
        <div className="profile-info">
          <strong>Petugas</strong>
          <span>Lihat pengaturan</span>
        </div>
      </button>

      {tampilkanModal && (
        <GantiPasswordModal onClose={() => setTampilkanModal(false)} />
      )}
    </div>
  );
}
