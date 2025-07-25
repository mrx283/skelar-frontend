// src/pages/DashboardStats.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const DashboardStats = () => {
  const [stats, setStats] = useState({ totalSKL: 0, totalQR: 0, totalLoginVerifikator: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/skl/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
        console.log(res.data);
      } catch (err) {
        console.error("Gagal mengambil statistik dashboard:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-cyan-800">📊 Statistik Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-semibold text-gray-700">Jumlah SKL yang Terdata</h3>
          <p className="text-4xl font-bold text-cyan-700 mt-2">{stats.totalSKL}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-semibold text-gray-700">Jumlah QR yang Sudah Dibuat</h3>
          <p className="text-4xl font-bold text-cyan-700 mt-2">{stats.totalQR}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
