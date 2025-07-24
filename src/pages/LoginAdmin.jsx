// src/pages/LoginAdmin.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      if (user.role !== "admin") {
        setShowModal(true); // ✅ tampilkan modal
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "❌ Gagal login");
    }
  };

  // ✅ Auto-close modal dalam 2.5 detik
  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        setShowModal(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showModal]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-100 px-4 relative">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-cyan-800 mb-6">Login Tata Usaha</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-gray-700 font-medium">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-700 font-medium">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="********"
            />
          </div>
          <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2.5 rounded-lg shadow-md transition-all duration-300">
            Masuk
          </button>
        </form>
        {error && <p className="mt-4 text-red-500 text-sm text-center font-medium">{error}</p>}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Belum punya akun admin?{" "}
            <button onClick={() => navigate("/admin/register")} className="text-cyan-700 hover:underline font-medium">
              Daftar di sini
            </button>
          </p>
        </div>
      </div>

      {/* ✅ Modal akses ditolak auto-close */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-center animate-fade-in">
            <h3 className="text-lg font-semibold text-red-600 mb-2">❌ Akses Ditolak</h3>
            <p className="text-gray-700">Akun ini bukan admin.</p>
          </div>
        </div>
      )}
    </div>
  );
}
