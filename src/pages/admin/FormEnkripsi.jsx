// frontend/src/pages/admin/FormEnkripsi.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const FormEnkripsi = () => {
  const [formData, setFormData] = useState({
    nama_siswa: "",
    nisn: "",
    nomor_skl: "",
    asal_sekolah: "",
    tahun_lulus: "",
    skl_id: "",
    admin_id: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Ambil data admin login saat pertama kali render
  useEffect(() => {
    const fetchLoggedInAdmin = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFormData((prev) => ({
          ...prev,
          admin_id: res.data.id,
        }));
      } catch (err) {
        console.error("❌ Gagal ambil data admin login:", err);
        setError("Gagal mengambil data admin login.");
      }
    };

    fetchLoggedInAdmin();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/rsa/encrypt`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan saat enkripsi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Form Enkripsi SKL</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="text" name="nama_siswa" placeholder="Nama Siswa" className="input" onChange={handleChange} />
        <input type="text" name="nisn" placeholder="NISN" className="input" onChange={handleChange} />
        <input type="text" name="nomor_skl" placeholder="Nomor SKL" className="input" onChange={handleChange} />
        <input type="text" name="asal_sekolah" placeholder="Asal Sekolah" className="input" onChange={handleChange} />
        <input type="text" name="tahun_lulus" placeholder="Tahun Lulus" className="input" onChange={handleChange} />
        <input type="text" name="skl_id" placeholder="SKL ID" className="input" onChange={handleChange} />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50" disabled={loading}>
          {loading ? "Mengenkripsi..." : "Buat QR"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {result && (
        <div className="mt-6 border p-4 rounded bg-gray-50">
          <h4 className="font-semibold mb-2">Hasil Enkripsi:</h4>
          <img src={result.qrCode} alt="QR Code" className="w-48 h-48 mb-2" />
          <p className="text-xs break-all">
            <strong>Encrypted:</strong> {result.encrypted}
          </p>
          <p className="text-xs mt-2">
            <strong>Public Key:</strong>
            <br />
            <pre className="whitespace-pre-wrap">{result.publicKeyPem}</pre>
          </p>
        </div>
      )}
    </div>
  );
};

export default FormEnkripsi;
