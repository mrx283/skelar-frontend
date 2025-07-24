import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterAdmin = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        name,
        email,
        password,
        role: "admin", // ⬅️ fix: force sebagai admin
      });

      setMessage("✅ Registrasi berhasil. Silakan login.");
      setTimeout(() => {
        navigate("/admin");
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Gagal registrasi");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-cyan-700 mb-6">Register Tata Usaha</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-700 font-medium">Nama</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Nama Lengkap"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-700 font-medium">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="********"
            />
          </div>
          <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-800 text-white font-semibold py-2 rounded-md transition-all duration-300">
            Daftar
          </button>
        </form>

        {message && <p className="mt-4 text-center text-sm text-red-600">{message}</p>}

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Sudah punya akun admin?{" "}
            <button onClick={() => navigate("/admin")} className="text-cyan-600 hover:underline">
              Login di sini
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterAdmin;
