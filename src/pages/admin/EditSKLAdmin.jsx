import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditSKLAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nama_siswa: "",
    nisn: "",
    nomor_skl: "",
    asal_sekolah: "",
    tahun_lulus: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchSKL = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/skl/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm(res.data);
        setLoading(false);
      } catch (err) {
        setMessage("❌ Gagal memuat data SKL");
        setLoading(false);
      }
    };
    fetchSKL();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/skl/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/admin/dashboard/skl");
    } catch (err) {
      setMessage("❌ Gagal menyimpan perubahan");
    }
  };

  if (loading) return <div className="max-w-xl mx-auto mt-10 text-center text-gray-600 font-medium">⏳ Memuat data...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-2xl rounded-xl border border-gray-200">
      <div className="mb-6">
        <button onClick={() => navigate("/admin/dashboard/skl")} className="bg-gray-400 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition">
          🔙 Kembali ke Data SKL
        </button>
      </div>
      <h2 className="text-3xl font-bold text-cyan-800 mb-6">✏️ Edit Data SKL</h2>
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
          💾 Simpan Perubahan
        </button>
        {message && <p className="mt-4 text-center text-red-600 font-semibold">{message}</p>}
      </form>
    </div>
  );
};

export default EditSKLAdmin;
