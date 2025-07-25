import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";

const DataQRAdmin = () => {
  const [data, setData] = useState([]);
  const [adminList, setAdminList] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState({});
  const [error, setError] = useState("");
  const [qrDataMap, setQRDataMap] = useState({});
  const [loadingId, setLoadingId] = useState(null);

  const navigate = useNavigate();

  const [popup, setPopup] = useState({ show: false, message: "", type: "" });
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchSKL();
    fetchAdminList();
    fetchQRData();
  }, []);

  const showPopup = (message, type = "success") => {
    setPopup({ show: true, message, type });
    setTimeout(() => {
      setPopup({ show: false, message: "", type: "" });
    }, 1500);
  };

  const fetchSKL = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/skl`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    } catch (err) {
      setError("❌ Gagal mengambil data SKL");
    }
  };

  const fetchAdminList = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/admin-list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdminList(res.data);
    } catch (err) {
      console.log(err);
      console.error("Gagal ambil admin:", err);
    }
  };

  const fetchQRData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/rsa/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const map = {};
      res.data.forEach((item) => {
        map[item.skl_id] = {
          encrypted: item.encrypted_text,
          qrCode: item.qr_code,
          admin_id: item.admin?.id, // ⬅ ini ambil dari backend
          admin_name: item.admin?.name, // ⬅ ini juga langsung ambil nama
        };
      });
      setQRDataMap(map);
    } catch (err) {
      console.log(err);
      console.error("Gagal ambil QR:", err);
    }
  };

  const handleAdminChange = (sklId, adminId) => {
    setSelectedAdmin((prev) => ({
      ...prev,
      [sklId]: adminId,
    }));
  };

  const generateEncryptedQR = async (skl) => {
    const adminId = selectedAdmin[skl.id];
    if (!adminId) {
      showPopup("⚠️ Silakan pilih admin terlebih dahulu!", "error");
      return;
    }
    if (!window.confirm("Yakin ingin mengenkripsi dan membuat QR untuk data ini?")) return;
    try {
      setLoadingId(skl.id);
      const payload = { ...skl, skl_id: skl.id, admin_id: adminId };
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/rsa/encrypt`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setQRDataMap((prev) => ({
        ...prev,
        [skl.id]: {
          encrypted: res.data.encrypted,
          qrCode: res.data.qrCode,
          admin_id: adminId,
        },
      }));
    } catch (err) {
      alert("❌ Gagal mengenkripsi data");
    } finally {
      setLoadingId(null);
    }
  };

  // const downloadDocx = async (sklId, namaSiswa) => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     const res = await axios.get(`http://localhost:5000/api/download/skl/${sklId}`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //       responseType: "blob",
  //     });
  //     const blob = new Blob([res.data], {
  //       type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  //     });
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = `SKL_${namaSiswa}.docx`;
  //     a.click();
  //     window.URL.revokeObjectURL(url);
  //   } catch (err) {
  //     alert("❌ Gagal download SKL");
  //   }
  // };

  const downloadPDF = async (skl) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/pdf/generate/${skl.id}`,
        {
          nama_siswa: skl.nama_siswa,
          nisn: skl.nisn,
          no_skl: skl.nomor_skl,
          tahun_lulus: skl.tahun_lulus,
        },
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `SKL_${skl.nama_siswa}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("❌ Gagal download PDF SKL");
      console.error(err);
    }
  };

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <h2 className="text-2xl font-bold text-cyan-800">🔐 Data QR SKL (RSA)</h2>
        <button onClick={() => navigate("/admin/dashboard")} className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-md shadow transition">
          🔙 Kembali ke Dashboard
        </button>
      </div>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 Cari nama, NISN, atau nomor SKL..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2 md:w-1/2 px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none"
        />
      </div>

      <div className="overflow-x-auto w-full rounded shadow">
        <table className="min-w-[700px] md:min-w-full bg-white border text-sm">
          <thead className="bg-cyan-700 text-white text-sm">
            <tr>
              <th className="border p-2 w-48">Nama</th>
              <th className="border p-2">NISN</th>
              <th className="border p-2">Nomor SKL</th>
              <th className="border p-2">Asal Sekolah</th>
              <th className="border p-2">Tahun Lulus</th>
              <th className="border p-2 w-39">Admin</th>
              <th className="border p-2 w-48">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data
              .filter(
                (item) =>
                  item.nama_siswa.toLowerCase().includes(search.toLowerCase()) || item.nisn.toLowerCase().includes(search.toLowerCase()) || item.nomor_skl.toLowerCase().includes(search.toLowerCase())
              )
              .map((skl) => (
                <React.Fragment key={skl.id}>
                  <tr className="hover:bg-gray-50 text-sm">
                    <td className="border p-2">{skl.nama_siswa}</td>
                    <td className="border p-2">{skl.nisn}</td>
                    <td className="border p-2">{skl.nomor_skl}</td>
                    <td className="border p-2">{skl.asal_sekolah}</td>
                    <td className="border p-2">{skl.tahun_lulus}</td>
                    <td className="border p-2 w-48">
                      {!qrDataMap[skl.id] ? (
                        <select value={selectedAdmin[skl.id] || ""} onChange={(e) => handleAdminChange(skl.id, e.target.value)} className="text-sm w-full border rounded px-2 py-1">
                          <option value="">Pilih Admin</option>
                          {adminList.map((admin) => (
                            <option key={admin.id} value={admin.id}>
                              {admin.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-green-700 font-medium">✅ Sudah dibuat oleh {qrDataMap[skl.id]?.admin_name || "Admin"}</p>
                      )}
                    </td>
                    <td className="border p-2 space-y-2">
                      <button
                        disabled={loadingId === skl.id || qrDataMap[skl.id]}
                        onClick={() => generateEncryptedQR(skl)}
                        className={`w-full text-sm px-3 py-1 rounded text-white ${qrDataMap[skl.id] ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
                      >
                        {loadingId === skl.id ? "⏳ Proses..." : "🔐 Buat QR"}
                      </button>
                      <button
                        disabled={!qrDataMap[skl.id]}
                        onClick={() => downloadPDF(skl)}
                        className={`w-full text-sm px-3 py-1 rounded text-white ${qrDataMap[skl.id] ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}
                      >
                        📥 Download SKL (PDF)
                      </button>
                    </td>
                  </tr>
                  {qrDataMap[skl.id] && (
                    <tr>
                      <td colSpan="7" className="border-t p-3 bg-slate-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          <div>
                            <strong>Hasil Enkripsi:</strong>
                            <pre className="bg-white border mt-1 p-2 rounded break-all overflow-x-auto">{qrDataMap[skl.id].encrypted}</pre>
                          </div>
                          <div>
                            <strong>QR Code (URL):</strong>
                            <QRCode value={`https://skelar-frontend.vercel.app/verifikasi/${skl.id}`} size={128} />
                            <p className="text-xs mt-1 break-all text-blue-700">{`https://skelar-frontend.vercel.app/verifikasi/${skl.id}`}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
          </tbody>
        </table>
      </div>
      {popup.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`bg-white px-6 py-4 rounded-lg shadow-lg text-center max-w-md w-full ${popup.type === "success" ? "border-l-8 border-green-600" : "border-l-8 border-red-600"}`}>
            <h3 className={`text-lg font-semibold mb-2 ${popup.type === "success" ? "text-green-700" : "text-red-700"}`}>{popup.message}</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataQRAdmin;
