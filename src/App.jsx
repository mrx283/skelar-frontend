// src/App.jsx
import { Routes, Route } from "react-router-dom";
import LoginAdmin from "./pages/LoginAdmin";
import RegisterAdmin from "./pages/RegisterAdmin";
import DataVerifikator from "./pages/admin/DataVerifikator";
import VerifikasiQRCode from "./pages/verifikasi/VerifikasiQRCode";

// halaman home
import Home from "./pages/Home";

// Layout & Admin Pages
import AdminDashboardLayout from "./layouts/AdminLayout";
import DashboardStats from "./pages/admin/DashboardStats";
import AdminTabelSKL from "./pages/AdminTabelSKL";
import TambahSKLAdmin from "./pages/admin/TambahSKLAdmin";
import EditSKLAdmin from "./pages/admin/EditSKLAdmin";
import DataQRAdmin from "./pages/admin/DataQRAdmin";
import FormEnkripsi from "./pages/admin/FormEnkripsi";

function App() {
  return (
    <Routes>
      {/* 🔐 Admin Login & Register */}
      <Route path="/admin" element={<LoginAdmin />} />
      <Route path="/admin/register" element={<RegisterAdmin />} />

      {/* halaman utama */}
      <Route path="/" element={<Home />} />

      <Route path="/verifikasi/:id" element={<VerifikasiQRCode />} />

      {/* 🖥️ Admin Dashboard Layout */}
      <Route path="/admin/dashboard" element={<AdminDashboardLayout />}>
        <Route index element={<DashboardStats />} />
        <Route path="skl" element={<AdminTabelSKL />} />
        <Route path="skl/tambah" element={<TambahSKLAdmin />} />
        <Route path="skl/edit/:id" element={<EditSKLAdmin />} />
        <Route path="qr" element={<DataQRAdmin />} />
        <Route path="form-enkripsi" element={<FormEnkripsi />} />
        <Route path="verifikator" element={<DataVerifikator />} />
      </Route>
    </Routes>
  );
}

export default App;
