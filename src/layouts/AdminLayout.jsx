import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

const AdminDashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false); // state buat toggle sidebar

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin");
  };

  const menuItems = [
    { label: "📊 Dashboard", path: "/admin/dashboard" },
    { label: "📄 Data SKL", path: "/admin/dashboard/skl" },
    { label: "🔐 Data QR", path: "/admin/dashboard/qr" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar (Dekstop) */}
      <aside className="hidden md:flex w-64 bg-cyan-800 text-white p-6 shadow-lg flex-col justify-between fixed h-screen">
        <div>
          <h2 className="text-2xl font-bold mb-8 text-center tracking-wide">🎓 Tata Usaha</h2>
          <nav className="space-y-2 text-sm">
            {menuItems.map((item) => (
              <Link key={item.path} to={item.path} className={`block px-4 py-2 rounded-md transition-all duration-200 ${isActive(item.path) ? "bg-cyan-600 font-semibold" : "hover:bg-cyan-600"}`}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition">
          🚪 Logout
        </button>
      </aside>

      {/* Sidebar (Mobile) */}
      <div className={`fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden ${sidebarOpen ? "block" : "hidden"}`} onClick={() => setSidebarOpen(false)}></div>
      <aside className={`fixed top-0 left-0 z-50 w-64 bg-cyan-800 text-white p-6 shadow-lg h-full transition-transform transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:hidden`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">🎓 Tata Usaha</h2>
          <button onClick={() => setSidebarOpen(false)} className="text-white text-xl font-bold">
            ✖
          </button>
        </div>
        <nav className="space-y-2 text-sm">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-2 rounded-md transition-all duration-200 ${isActive(item.path) ? "bg-cyan-600 font-semibold" : "hover:bg-cyan-600"}`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-6">
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition w-full">
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 w-full min-h-screen">
        {/* Topbar (mobile) */}
        <div className="md:hidden flex items-center justify-between bg-white shadow p-4 sticky top-0 z-40">
          <button onClick={() => setSidebarOpen(true)} className="text-cyan-800 text-2xl font-bold">
            ☰
          </button>
          <h1 className="text-lg font-semibold">Dashboard Admin</h1>
        </div>

        <main className="p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
