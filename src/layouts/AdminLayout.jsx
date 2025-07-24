import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";

const AdminDashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin");
  };

  const menuItems = [
    { label: "📊 Dashboard", path: "/admin/dashboard" },
    { label: "📄 Data SKL", path: "/admin/dashboard/skl" },
    { label: "🔐 Data QR", path: "/admin/dashboard/qr" },
    { label: "👥 Data Verifikator", path: "/admin/dashboard/verifikator" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-cyan-800 text-white p-6 shadow-lg flex flex-col justify-between h-screen fixed">
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

        {/* Tombol Logout yang selalu di bawah */}
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition">
          🚪 Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-6 overflow-y-auto min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboardLayout;
