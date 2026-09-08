import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import FormMasuk from "./pages/FormMasuk";
import FormKeluar from "./pages/FormKeluar";
import StatusKunjungan from "./pages/StatusKunjungan";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTamuMenunggu from "./pages/AdminTamuMenunggu";
import AdminRiwayatTamu from "./pages/AdminRiwayatTamu";
import AdminTamuHariIni from "./pages/AdminTamuHariIni";
import AdminLayout from "./components/AdminLayout";

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Navigate to="/form-masuk" replace />} />
          <Route path="/form-masuk" element={<FormMasuk />} />
          <Route path="/form-keluar" element={<FormKeluar />} />
          <Route path="/status/:id" element={<StatusKunjungan />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="admin-tamu-menunggu" element={<AdminTamuMenunggu />} />
            <Route path="admin-riwayat-tamu" element={<AdminRiwayatTamu />} />
            <Route path="admin-tamu-hari-ini" element={<AdminTamuHariIni />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
