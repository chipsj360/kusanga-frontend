import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import '../assets/css/dashboard.css';
const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const closeOnDesktop = () => {
      if (window.innerWidth >= 1200) setIsSidebarOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsSidebarOpen(false);
    };

    window.addEventListener("resize", closeOnDesktop);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("resize", closeOnDesktop);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  return (
    <div className="d-flex">
      {/* Sidebar (fixed) */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main content area */}
      <div className="flex-grow-1 d-flex flex-column content-wrapper">
          <div className="sticky-top bg-white shadow-sm">
          <Navbar
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
          />
        </div>
        <main className="p-4 bg-light min-vh-100">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout