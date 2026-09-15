import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAutentikasiAdmin } from "../context/AutentikasiAdminContext";
import { useToast } from "../context/ToastContext";
import GantiPasswordModal from "./GantiPasswordModal";

export default function ProfileMenu() {
  const { admin, logout } = useAutentikasiAdmin();
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
    logout();
    tampilkanToast("Anda telah logout.");
    navigate("/login");
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
        <div className="profile-avatar">
          {(admin?.namaPetugas || "P").charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">


          <strong>{admin?.namaPetugas || "Petugas"}</strong>

          {/* Kalo mau nampilin usernamenya juga yang dibawah tinggal nyalain */}
          
          {/* <span>@{admin?.username || "-"}</span> */}

        </div>
      </button>

      {tampilkanModal && (
        <GantiPasswordModal onClose={() => setTampilkanModal(false)} />
      )}
    </div>
  );
}
