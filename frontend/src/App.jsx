import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import { AutentikasiProvider } from "./context/AutentikasiAdminContext";

import ProtectedRoute from "./components/ProteksiRute";
import AdminLayout from "./components/AdminLayout";

import FormMasuk from "./pages/FormMasuk";
import FormKeluar from "./pages/FormKeluar";
import StatusKunjungan from "./pages/StatusKunjungan";
import Login from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTamuMenunggu from "./pages/AdminTamuMenunggu";
import AdminRiwayatTamu from "./pages/AdminRiwayatTamu";
import AdminTamuHariIni from "./pages/AdminTamuHariIni";
import AdminListPetugasAdmin from "./pages/AdminListPetugasAdmin";

export default function App() {
  return (
    <ToastProvider>
      <AutentikasiProvider>
        <BrowserRouter>
          <Routes>

            <Route path="/" element={<Navigate to="/form-masuk" replace />} />
            <Route path="/form-masuk" element={<FormMasuk />} />
            <Route path="/form-keluar" element={<FormKeluar />} />
            <Route path="/status/:id" element={<StatusKunjungan />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              
              <Route path="admin-tamu-menunggu" element={<AdminTamuMenunggu />} />
              <Route path="admin-riwayat-tamu" element={<AdminRiwayatTamu />} />
              <Route path="admin-tamu-hari-ini" element={<AdminTamuHariIni />} />

              <Route path="admin-list-petugas-admin" element={<AdminListPetugasAdmin />} />
            </Route>

          </Routes>
        </BrowserRouter>
      </AutentikasiProvider>
    </ToastProvider>
  );
}
