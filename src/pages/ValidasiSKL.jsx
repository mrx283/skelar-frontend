import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ValidasiSKL = () => {
  const [nomorSKL, setNomorSKL] = useState("");
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setMessage("");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/skl/validasi/${nomorSKL}`);
      setResult(res.data.data);
    } catch (err) {
      setResult(null);
      setMessage(err.response?.data?.message || "Terjadi kesalahan");
    }
  };

  const handleDownloadAndNavigate = () => {
    const link = document.createElement("a");
    link.href = result.qr_code;
    link.download = `qr_image_${result.nomor_skl || "hasil"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Setelah download, redirect ke halaman upload
    setTimeout(() => {
      navigate("/verifikator/upload");
    }, 2000);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center text-cyan-700">Validasi SKL</h2>
      <form onSubmit={handleSubmit} className="mb-4 space-y-3">
        <input type="text" value={nomorSKL} onChange={(e) => setNomorSKL(e.target.value)} placeholder="Masukkan Nomor SKL" className="w-full border p-2 rounded" required />
        <button type="submit" className="w-full bg-cyan-600 text-white py-2 rounded hover:bg-cyan-700">
          Validasi
        </button>
      </form>

      {message && <p className="text-red-500 text-center">{message}</p>}

      {result && (
        <div className="mt-6 border-t pt-4 space-y-2">
          <h3 className="font-semibold text-lg text-cyan-800">✅ SKL Valid</h3>
          <p>
            <strong>Nama:</strong> {result.nama_siswa}
          </p>
          <p>
            <strong>NISN:</strong> {result.nisn}
          </p>
          <p>
            <strong>Asal Sekolah:</strong> {result.asal_sekolah}
          </p>
          <p>
            <strong>Tahun Lulus:</strong> {result.tahun_lulus}
          </p>
          {result.qr_code && (
            <div className="mt-4 flex flex-col items-center">
              <img src={result.qr_code} alt="QR Code" className="w-40 mb-2" />
              <button onClick={handleDownloadAndNavigate} className="mt-2 px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-800">
                Download QR & Lanjut Verifikasi
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ValidasiSKL;
