// src/pages/Modules.jsx
import { useEffect, useState } from "react";
import API from "../api";
import AddModule from "./AddModule";
import EditModule from "./EditModule";
import ViewModule from "./ViewModule";
import "../assets/css/bootstrap.min.css";
import "../assets/css/user.css";

const Modules = () => {
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const res = await API.get("/api/modules/");
      setModules(res.data);
    } catch (err) {
      console.error("Error fetching Modules:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Module?")) return;
    try {
      await API.delete(`/api/modules/${id}/`);
      setModules(modules.filter((m) => m.id !== id));
      setShowView(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container-fluid px-3">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <h3 className="mb-2">Module Management</h3>
        <button className="btn btn-danger mb-2" onClick={() => setShowAdd(true)}>
          Add New Module
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by title or description"
        className="form-control text-dark border rounded mb-3"
      />

      {/* Cards Grid */}
      <div className="row g-3">
        {modules.map((module) => (
          <div key={module.id} className="col-md-4 col-sm-6">
            <div
              className="card h-100 shadow-sm border-0 rounded-3"
              style={{ cursor: "pointer", transition: "transform 0.2s" }}
              onClick={() => {
                setSelectedModule(module);
                setShowView(true);
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.03)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <div className="card-body">
                <h5 className="card-title text-dark fw-bold">{module.title}</h5>
                <p className="card-text text-muted">
                  {module.description?.length > 100
                    ? module.description.substring(0, 100) + "..."
                    : module.description}
                </p>
                <span className="badge bg-primary">
                  Course: {module.course_title || "N/A"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {showAdd && (
        <AddModule onClose={() => setShowAdd(false)} onSuccess={fetchModules} />
      )}

      {showView && selectedModule && (
        <ViewModule
          module={selectedModule}
          onClose={() => setShowView(false)}
          onDelete={handleDelete}
          onEdit={() => {
            setShowView(false);
            setShowEdit(true);
          }}
        />
      )}

      {showEdit && selectedModule && (
        <EditModule
          module={selectedModule}
          onClose={() => setShowEdit(false)}
          onSuccess={() => {
            fetchModules();
            setShowEdit(false);
          }}
        />
      )}
    </div>
  );
};

export default Modules;
