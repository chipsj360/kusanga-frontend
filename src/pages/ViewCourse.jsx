// src/pages/ViewCourse.jsx
import { useEffect, useState } from "react";
import API from "../api";
import AddModule from "./AddModule";
import ViewModule from "./ViewModule";

const ViewCourse = ({ course, onClose, onDelete, onEdit }) => {
const role = localStorage.getItem("role");
const canManage = role === "trainer" || role === "admin";

  const [modules, setModules] = useState([]);
  const [showAddModule, setShowAddModule] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null); // used for edit & launch
  const [showEditModule, setShowEditModule] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [dueDate, setDueDate] = useState(""); // YYYY-MM-DD
  const [enrolling, setEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState("");
  const [enrollSuccess, setEnrollSuccess] = useState("");
  const [enrollments, setEnrollments] = useState([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);
  const [unenrollError, setUnenrollError] = useState("");

const fetchEnrollments = async () => {
  if (!canManage) return;
  setLoadingEnrollments(true);
  setUnenrollError("");
  try {
    const res = await API.get(`/api/enrollments/?course=${course.id}`);
    setEnrollments(res.data || []);
  } catch (err) {
    console.error("Error fetching enrollments:", err);
    setUnenrollError("Failed to load enrolled students.");
  } finally {
    setLoadingEnrollments(false);
  }
};

const fetchStudents = async () => {
  try {
    // UserViewSet is trainer/admin only (good)
    const res = await API.get("/api/users/");
    const onlyStudents = res.data.filter((u) => u.role === "student");
    setStudents(onlyStudents);
  } catch (err) {
    console.error("Error fetching students:", err);
    setEnrollError("Failed to load students. Make sure you are admin/trainer.");
  }
};

const openEnrollModal = async () => {
  setEnrollError("");
  setEnrollSuccess("");
  setSelectedStudentId("");
  setDueDate("");
  setShowEnrollModal(true);
  await fetchStudents();
};

const handleEnroll = async (e) => {
  e.preventDefault();
  setEnrollError("");
  setEnrollSuccess("");

  if (!selectedStudentId) {
    setEnrollError("Please select a student.");
    return;
  }

  setEnrolling(true);
  try {
    const payload = {
      user: Number(selectedStudentId),
      course: course.id,
      due_date: dueDate ? `${dueDate}T00:00:00Z` : null,
      completed: false,
    };

    await API.post("/api/enrollments/", payload);
    setEnrollSuccess("Student enrolled successfully!");
  } catch (err) {
    console.error("Enroll error:", err?.response?.data || err);

    // common error: unique_together violation
    const msg =
      err?.response?.data?.non_field_errors?.[0] ||
      err?.response?.data?.detail ||
      "Failed to enroll student. The student may already be enrolled.";
    setEnrollError(msg);
  } finally {
    setEnrolling(false);
  }
};

  // Fetch all modules for the selected course
  useEffect(() => {
    fetchModules();
    fetchEnrollments();
  }, [course]);

  const handleUnenroll = async (enrollmentId) => {
    if (!window.confirm("Unenroll this student from the course?")) return;

    try {
      await API.delete(`/api/enrollments/${enrollmentId}/`);
      setEnrollments((prev) => prev.filter((e) => e.id !== enrollmentId));
    } catch (err) {
      console.error("Unenroll error:", err?.response?.data || err);
      setUnenrollError(
        err?.response?.data?.detail || "Failed to unenroll student."
      );
    }
  };


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
      setSelectedModule(null);
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
      setSelectedModule(null);
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
      {/* --- Course Modal --- */}
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
              {canManage && (
  <>
    <hr />
    <div className="d-flex justify-content-between align-items-center mb-2">
      <h5 className="fw-bold mb-0">Enrolled Students</h5>
      <button className="btn btn-outline-secondary btn-sm" onClick={fetchEnrollments}>
        Refresh
      </button>
    </div>

    {unenrollError && <div className="alert alert-danger">{unenrollError}</div>}

    {loadingEnrollments ? (
      <p className="text-muted">Loading enrollments...</p>
    ) : enrollments.length ? (
      <div className="table-responsive">
        <table className="table table-sm table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Enrolled At</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((enr, idx) => {
              const u = enr.user_detail || {};
              return (
                <tr key={enr.id}>
                  <td>{idx + 1}</td>
                  <td>{u.full_name || "—"}</td>
                  <td>{u.email || "—"}</td>
                  <td>{enr.enrolled_at ? new Date(enr.enrolled_at).toLocaleDateString() : "—"}</td>
                  <td>{enr.due_date ? new Date(enr.due_date).toLocaleDateString() : "—"}</td>
                  <td>{enr.completed ? "Completed" : "In progress"}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleUnenroll(enr.id)}
                    >
                      Unenroll
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    ) : (
      <p className="text-muted">No students enrolled in this course yet.</p>
    )}
  </>
)}

              {/* --- Course Details --- */}
              <div className="mb-3"><strong>Description:</strong> {course.description}</div>
              <div className="mb-2"><strong>Type:</strong> {course.course_type}</div>
              <div className="mb-2"><strong>Duration:</strong> {course.duration || "-"}</div>
              <div className="mb-2"><strong>Created By:</strong> {course.created_by || "-"}</div>

              <hr />

                  {/* --- Modules Section --- */}
                {canManage && (
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="fw-bold mb-0">Modules</h5>

                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={openEnrollModal}
                      >
                        Enroll Student
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => setShowAddModule(true)}
                      >
                        + Add Module
                      </button>
                    </div>
                  </div>
                )}

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
                            className="btn btn-success btn-sm me-2"
                            onClick={() => setSelectedModule(m)} // Launch module
                          >
                            Launch
                          </button>
                        {canManage &&(
                          <>

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
                          </>
                          )}
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
              { canManage &&(<div>
                <button className="btn btn-warning me-2" onClick={onEdit}>
                  Edit Course
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => onDelete(course.id)}
                >
                  Delete Course
                </button>
              </div> )}
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
                      required
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

      {/* --- Launch Module Modal --- */}
      {selectedModule && !showEditModule && (
        <ViewModule
          module={selectedModule}
          onClose={() => setSelectedModule(null)}
          onDelete={handleDeleteModule}
          onEdit={() => setShowEditModule(true)}
        />
      )}
      {showEnrollModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <form onSubmit={handleEnroll}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    Enroll Student — <span className="fw-bold">{course.title}</span>
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowEnrollModal(false)}
                  ></button>
                </div>

                <div className="modal-body">
                  {enrollError && (
                    <div className="alert alert-danger">{enrollError}</div>
                  )}
                  {enrollSuccess && (
                    <div className="alert alert-success">{enrollSuccess}</div>
                  )}

                  <div className="mb-3">
                    <label className="form-label">Select Student</label>
                    <select
                      className="form-select"
                      value={selectedStudentId}
                      onChange={(e) => setSelectedStudentId(e.target.value)}
                      required
                    >
                      <option value="">-- Choose a student --</option>
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.full_name || s.username} ({s.email})
                        </option>
                      ))}
                    </select>
                    <small className="text-muted">
                      Only users with role <b>student</b> are shown.
                    </small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Due Date (optional)</label>
                    <input
                      type="date"
                      className="form-control"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={enrolling}
                  >
                    {enrolling ? "Enrolling..." : "Enroll"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowEnrollModal(false)}
                    disabled={enrolling}
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
