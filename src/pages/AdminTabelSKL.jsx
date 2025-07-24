import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AdminTabelSKL = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/skl", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(res.data);
      setLoading(false);
    } catch (err) {
      setError("Gagal memuat data SKL");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data SKL akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "🗑️ Hapus",
      cancelButtonText: "❌ Batal",
      reverseButtons: true, // biar "Batal" di kiri, "Hapus" di kanan
      focusCancel: true, // auto fokus ke "Batal"
      customClass: {
        confirmButton: "swal2-confirm-button",
        cancelButton: "swal2-cancel-button",
      },
      buttonsStyling: false, // supaya bisa custom styling sendiri
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/skl/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        await Swal.fire({
          title: "✅ Terhapus!",
          text: "Data SKL berhasil dihapus.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        fetchData();
      } catch (err) {
        Swal.fire("❌ Gagal!", "Terjadi kesalahan saat menghapus.", "error");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold text-cyan-800">📄 Data SKL</h2>
        <button onClick={() => navigate("/admin/dashboard/skl/tambah")} className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-4 py-2 rounded-md shadow-md transition">
          ➕ Tambah SKL
        </button>
      </div>

      <div>
        <input
          type="text"
          placeholder="Cari nama, NISN, atau nomor SKL..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none"
        />
      </div>

      {loading ? (
        <p className="text-gray-600">Loading data...</p>
      ) : error ? (
        <p className="text-red-600 font-medium">{error}</p>
      ) : (
        <div className="overflow-x-auto shadow border border-gray-200 rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-cyan-700 text-white text-left text-sm">
              <tr>
                <th className="px-4 py-2">Nama</th>
                <th className="px-4 py-2">NISN</th>
                <th className="px-4 py-2">Nomor SKL</th>
                <th className="px-4 py-2">Asal Sekolah</th>
                <th className="px-4 py-2">Tahun Lulus</th>
                <th className="px-4 py-2 ">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100 text-sm">
              {data
                .filter(
                  (item) =>
                    item.nama_siswa.toLowerCase().includes(search.toLowerCase()) ||
                    item.nisn.toLowerCase().includes(search.toLowerCase()) ||
                    item.nomor_skl.toLowerCase().includes(search.toLowerCase())
                )
                .map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-2">{item.nama_siswa}</td>
                    <td className="px-4 py-2">{item.nisn}</td>
                    <td className="px-4 py-2">{item.nomor_skl}</td>
                    <td className="px-4 py-2">{item.asal_sekolah}</td>
                    <td className="px-4 py-2">{item.tahun_lulus}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button onClick={() => handleDelete(item.id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs">
                        🗑 Hapus
                      </button>
                      <button onClick={() => navigate(`/admin/dashboard/skl/edit/${item.id}`)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs">
                        ✏️ Edit
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminTabelSKL;
