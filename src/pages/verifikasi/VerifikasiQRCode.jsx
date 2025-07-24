import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const VerifikasiQRCode = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}:5000/api/rsa/${id}`);
        setData(res.data);
        setValid(true);
      } catch (error) {
        setValid(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-lg sm:text-xl font-medium text-gray-700 animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 px-4 py-6">
      <div className="bg-white shadow-xl rounded-xl px-4 py-6 sm:px-6 sm:py-8 md:px-8 w-full max-w-md text-center border border-gray-200">
        {valid ? (
          <>
            <h2 className="text-2xl sm:text-3xl font-bold text-green-600 mb-6">✅ QR Valid</h2>
            <div className="grid grid-cols-3 gap-y-3 text-left text-sm sm:text-base text-gray-700">
              <span className="font-semibold col-span-1">👤 Nama</span>
              <span className="col-span-2">: {data?.skl?.nama_siswa}</span>

              <span className="font-semibold col-span-1">🆔 NISN</span>
              <span className="col-span-2">: {data?.skl?.nisn}</span>

              <span className="font-semibold col-span-1">📄 No. SKL</span>
              <span className="col-span-2">: {data?.skl?.nomor_skl}</span>

              <span className="font-semibold col-span-1">🎓 Tahun Lulus</span>
              <span className="col-span-2">: {data?.skl?.tahun_lulus}</span>
            </div>
          </>
        ) : (
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-red-600 mb-4">❌ QR Tidak Valid</h2>
            <p className="text-sm sm:text-base text-gray-600">QR Code yang dimasukkan tidak ditemukan atau rusak.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifikasiQRCode;
