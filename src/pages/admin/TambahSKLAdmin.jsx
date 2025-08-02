import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const TambahSKLAdmin = () => {
  const [form, setForm] = useState({
    nama_siswa: "",
    nisn: "",
    nomor_skl: "",
    asal_sekolah: "",
    tahun_lulus: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${import.meta.env.VITE_API_URL}/api/skl`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Tampilkan popup sukses
      await Swal.fire({
        title: "✅ Berhasil!",
        text: "SKL berhasil ditambahkan.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
      });

      navigate("/admin/dashboard/skl");
    } catch (err) {
      Swal.fire({
        title: "❌ Gagal!",
        text: "Terjadi kesalahan saat menambahkan SKL.",
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-2xl rounded-xl border border-gray-200">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-cyan-800">➕ Tambah SKL</h2>
        <button onClick={() => navigate("/admin/dashboard/skl")} className="bg-gray-400 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition">
          🔙 Kembali ke Dashboard
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {["nama_siswa", "nisn", "nomor_skl", "asal_sekolah", "tahun_lulus"].map((field) => (
          <div key={field}>
            <label className="block text-gray-700 font-medium capitalize mb-1">{field.replace("_", " ")}</label>
            <input
              type="text"
              name={field}
              required
              value={form[field]}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder={`Masukkan ${field.replace("_", " ")}`}
            />
          </div>
        ))}
        <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2.5 rounded-md shadow-md transition">
          💾 Simpan SKL
        </button>
      </form>
      {message && <p className="mt-6 text-center text-cyan-700 font-semibold">{message}</p>}
    </div>
  );
};

export default TambahSKLAdmin;
