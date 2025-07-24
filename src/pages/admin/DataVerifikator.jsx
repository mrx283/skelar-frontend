import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DataVerifikator = () => {
  const [verifikators, setVerifikators] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVerifikators = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/verifikator-list`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVerifikators(response.data);
      } catch (err) {
        console.error("❌ Gagal mengambil data verifikator:", err);
      }
    };

    fetchVerifikators();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-cyan-800">👥 Data Verifikator</h2>
        <button onClick={() => navigate("/admin/dashboard")} className="bg-gray-400 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition">
          🔙 Kembali ke Dashboard
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full table-auto border border-gray-300">
          <thead className="bg-cyan-700 text-white">
            <tr>
              <th className="p-3 text-left border">Nama</th>
              <th className="p-3 text-left border">Email</th>
              <th className="p-3 text-left border">Tanggal Daftar</th>
            </tr>
          </thead>
          <tbody>
            {verifikators.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center text-gray-500 p-4">
                  Tidak ada data verifikator
                </td>
              </tr>
            ) : (
              verifikators.map((v) => (
                <tr key={v.id} className="hover:bg-slate-100 border-b">
                  <td className="p-3 border">{v.name}</td>
                  <td className="p-3 border">{v.email}</td>
                  <td className="p-3 border">
                    {new Date(v.createdAt).toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataVerifikator;
