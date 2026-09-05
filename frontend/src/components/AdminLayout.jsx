import { NavLink, Outlet } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/admin-tamu-menunggu", label: "Tamu Menunggu" },
  { to: "/admin/admin-riwayat-tamu", label: "Riwayat Tamu" },
  { to: "/admin/admin-tamu-hari-ini", label: "Tamu Hari Ini" },
];

export default function AdminLayout() {
  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark">B</div>
          <div>
            <strong>BBMKG WILAYAH II</strong>
            <span>Petugas / Admin</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
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

      <main className="main-panel">
        <Outlet />
      </main>
    </div>
  );
}
