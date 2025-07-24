import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#2F5249" }}>
      {/* Navbar */}
      <nav className="shadow-md py-4 px-6 flex items-center" style={{ backgroundColor: "#E7FBB4" }}>
        <motion.img src="/logo-brand.png" alt="SKELUS Logo" className="h-10 mr-3 cursor-pointer" whileHover={{ rotate: [0, -5, 5, -5, 0], transition: { duration: 0.6 } }} />
      </nav>

      {/* Konten Tengah */}
      <main className="flex flex-col justify-center items-center flex-grow">
        <motion.h1
          initial={{ opacity: 0, filter: "blur(10px)", y: -20 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 1.5 }}
          className="text-3xl font-bold text-white text-center mb-10"
        >
          Surat Keterangan Lulus Digital <br /> SDN 064024
        </motion.h1>

        <div className="flex flex-row space-x-6">
          {/* Tombol Login Admin */}
          <button onClick={() => navigate("/admin")} className="relative flex items-center px-6 py-3 overflow-hidden font-medium transition-all bg-emerald-500 rounded-md group">
            <span className="absolute top-0 right-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-emerald-800 rounded group-hover:-mr-4 group-hover:-mt-4">
              <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white" />
            </span>
            <span className="absolute bottom-0 rotate-180 left-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-emerald-700 rounded group-hover:-ml-4 group-hover:-mb-4">
              <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white" />
            </span>
            <span
              className="absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full rounded-md group-hover:translate-x-0"
              style={{ backgroundColor: "#437057" }}
            />
            <span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-white">🔐 Login sebagai Admin</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-white text-left py-4 text-sm opacity-80">&copy; {new Date().getFullYear()} Muhammad Nur Fajri. All rights reserved.</footer>
    </div>
  );
};

export default Home;
