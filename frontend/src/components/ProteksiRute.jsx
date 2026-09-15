import { Navigate } from "react-router-dom";
import { useAutentikasiAdmin } from "../context/AutentikasiAdminContext";

export default function ProteksiRute({ children }) {
  const { sudahLogin, memuatSesi } = useAutentikasiAdmin();

  // Jangan buru-buru redirect sebelum tahu pasti — tunggu hasil verifikasi
  // ke server dulu, supaya tidak salah lempar ke /login padahal sesi
  // sebenarnya masih valid (atau sebaliknya).
  if (memuatSesi) {
    return (
      <div style={{ padding: 60, textAlign: "center", color: "#6b7686" }}>
        Memeriksa sesi...
      </div>
    );
  }

  if (!sudahLogin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
