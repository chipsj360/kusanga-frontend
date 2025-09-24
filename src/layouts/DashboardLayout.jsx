import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import '../assets/css/dashboard.css';
const DashboardLayout = ({ children }) => {
  return (
    <div className="d-flex">
      {/* Sidebar (fixed) */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-grow-1 d-flex flex-column content-wrapper">
          <div className="sticky-top bg-white shadow-sm">
          <Navbar />
        </div>
        <main className="p-4 bg-light min-vh-100">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
