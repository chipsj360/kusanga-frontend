// src/pages/ViewCourse.jsx
import { useEffect, useState } from "react";
import API from "../api";
import AddModule from "./AddModule";

const ViewCourse = ({ course, onClose, onDelete, onEdit }) => {
  const [modules, setModules] = useState([]);
  const [showAddModule, setShowAddModule] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [showEditModule, setShowEditModule] = useState(false);

  // Fetch all modules for the selected course
  useEffect(() => {
    fetchModules();
  }, [course]);

  const fetchModules = async () => {
    try {
      const res = await API.get(`/api/modules/?course=${course.id}`);
      setModules(res.data);
    } catch (err) {
      console.error("Error fetching modules:", err);
    }
  };

  const handleDeleteModule = async (id) => {
    if (!window.confirm("Are you sure you want to delete this module?")) return;
    try {
      await API.delete(`/api/modules/${id}/`);
      setModules(modules.filter((m) => m.id !== id));
    } catch (err) {
      console.error("Error deleting module:", err);
    }
  };

  const handleEditModule = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/api/modules/${selectedModule.id}/`, selectedModule);
      fetchModules();
      setShowEditModule(false);
      alert("Module updated successfully!");
    } catch (err) {
      console.error("Error updating module:", err);
    }
  };

  const handleModuleChange = (e) => {
    setSelectedModule({
      ...selectedModule,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <div className="modal show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content rounded-3 shadow">
            <div className="modal-header bg-light">
              <h5 className="modal-title fw-bold text-dark">
                {course.title} — Details
              </h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>

            <div className="modal-body text-dark">
              {/* --- Course Details --- */}
              <div className="mb-3"><strong>Description:</strong> {course.description}</div>
              <div className="mb-2"><strong>Type:</strong> {course.course_type}</div>
              <div className="mb-2"><strong>Duration:</strong> {course.duration || "-"}</div>
              <div className="mb-2"><strong>Created By:</strong> {course.created_by || "-"}</div>

              <hr />
              {/* --- Modules Section --- */}
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="fw-bold">Modules</h5>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => setShowAddModule(true)}
                >
                  + Add Module
                </button>
              </div>

              {modules.length > 0 ? (
                <table className="table table-striped table-bordered">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Order</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modules.map((m, index) => (
                      <tr key={m.id}>
                        <td>{index + 1}</td>
                        <td>{m.title}</td>
                        <td>{m.description}</td>
                        <td>{m.order}</td>
                        <td>
                          <button
                            className="btn btn-warning btn-sm me-2"
                            onClick={() => {
                              setSelectedModule(m);
                              setShowEditModule(true);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteModule(m.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-muted">No modules added yet.</p>
              )}
            </div>

            <div className="modal-footer d-flex justify-content-between">
              <div>
                <button className="btn btn-warning me-2" onClick={onEdit}>
                  Edit Course
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => onDelete(course.id)}
                >
                  Delete Course
                </button>
              </div>
              <button className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Add Module Modal --- */}
      {showAddModule && (
        <AddModule
          selectedCourse={course}
          onClose={() => setShowAddModule(false)}
          onSuccess={fetchModules}
        />
      )}

      {/* --- Edit Module Modal --- */}
      {showEditModule && selectedModule && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <form onSubmit={handleEditModule}>
                <div className="modal-header">
                  <h5 className="modal-title">Edit Module</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowEditModule(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label>Title</label>
                    <input
                      type="text"
                      name="title"
                      className="form-control text-dark bg-white"
                      value={selectedModule.title}
                      onChange={handleModuleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label>Description</label>
                    <textarea
                      name="description"
                      className="form-control text-dark bg-white"
                      rows="3"
                      value={selectedModule.description}
                      onChange={handleModuleChange}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label>Order</label>
                    <input
                      type="number"
                      name="order"
                      className="form-control text-dark bg-white"
                      value={selectedModule.order}
                      onChange={handleModuleChange}
                      min="1"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-success">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowEditModule(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewCourse;
