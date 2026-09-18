import { NavLink, Outlet } from "react-router-dom";
import { useAutentikasiAdmin } from "../context/AutentikasiAdminContext";
import ProfileMenu from "./ProfileMenu";
import Footer from "./Footer";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", end: true },
  
  { to: "/admin/admin-tamu-menunggu", label: "Tamu Menunggu" },
  { to: "/admin/admin-riwayat-tamu", label: "Riwayat Tamu" },
  { to: "/admin/admin-tamu-hari-ini", label: "Tamu Hari Ini" },

  { to: "/admin/admin-list-petugas-admin", label: "List Petugas Admin", hanyaUtama: true}
];

export default function AdminLayout() {
  const { admin } = useAutentikasiAdmin();
  const navItems = NAV_ITEMS.filter((item) => !item.hanyaUtama || admin?.role === "utama");

  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div>
            <strong>LOGBOOK KUNJUNGAN TAMU RUANGAN JARKOM BBMKG WILAYAH II</strong>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `nav-item${isActive ? " active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <ProfileMenu />
      </aside>

      <div className="admin-content">
          <main className="main-panel">
            <Outlet />
          </main>

          <Footer />
      </div>

    </div>
  );
}
