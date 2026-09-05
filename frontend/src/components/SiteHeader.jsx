export default function SiteHeader({ badge }) {
  return (
    <header className="site-header">
      <div className="brand">
        <div className="brand-mark">B</div>
        <div>
          <strong>BBMKG WILAYAH II</strong>
          <span>Sistem Buku Tamu</span>
        </div>
      </div>
      <div className="header-badge">{badge}</div>
    </header>
  );
}
