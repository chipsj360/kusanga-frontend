// src/pages/ViewCourse.jsx
import { useEffect, useState } from "react";
import API from "../api";
import AddModule from "./AddModule";
import ViewModule from "./ViewModule";
import "../assets/css/viewCourse.css";

const getUserDisplayName = (user) =>
  user?.full_name?.trim() || user?.username || "Unknown user";

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
  const [creatorName, setCreatorName] = useState(
    course.created_by_name || course.created_by_username || "Loading...",
  );





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

  }, [course]);

  useEffect(() => {
    let active = true;

    const fetchCreator = async () => {
      if (course.created_by_name || course.created_by_username) {
        setCreatorName(course.created_by_name || course.created_by_username);
        return;
      }

      try {
        const endpoint = course.created_by
          ? `/api/users/${course.created_by}/`
          : "/api/auth/user/";
        const response = await API.get(endpoint);
        if (active) setCreatorName(getUserDisplayName(response.data));
      } catch (error) {
        console.error("Error fetching course creator:", error);

        try {
          const response = await API.get("/api/auth/user/");
          if (active && (!course.created_by || response.data.id === course.created_by)) {
            setCreatorName(getUserDisplayName(response.data));
          } else if (active) {
            setCreatorName("Unknown user");
          }
        } catch (currentUserError) {
          console.error("Error fetching current user:", currentUserError);
          if (active) setCreatorName("Unknown user");
        }
      }
    };

    fetchCreator();
    return () => {
      active = false;
    };
  }, [course.created_by, course.created_by_name, course.created_by_username]);




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
      // Send only editable scalar fields. The full module object contains file
      // URLs, which Django rejects when a FileField expects an uploaded file.
      await API.patch(`/api/modules/${selectedModule.id}/`, {
        title: selectedModule.title,
        description: selectedModule.description || "",
        order: Number(selectedModule.order) || 1,
      });
      fetchModules();
      setShowEditModule(false);
      setSelectedModule(null);
      alert("Module updated successfully!");
    } catch (err) {
      console.error("Module update failed:", err.response?.data || err);
      alert("Error updating module. Check the console for validation details.");
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
      <style>{`
        .view-course-modal .modal-title,
        .view-course-modal .modal-body,
        .course-modules-table td {
          overflow-wrap: anywhere;
          word-break: break-word;
        }

        .course-modules-table th,
        .course-modules-table td {
          vertical-align: middle;
        }

        @media (max-width: 767.98px) {
          .view-course-modal .modal-header {
            align-items: flex-start;
            gap: 0.75rem;
          }

          .view-course-modal .modal-title {
            min-width: 0;
            font-size: 1rem;
          }

          .view-course-module-toolbar,
          .view-course-module-toolbar > div {
            width: 100%;
          }

          .view-course-module-toolbar > div > .btn {
            flex: 1 1 auto;
          }

          .course-modules-table-wrapper {
            overflow-x: visible;
          }

          .course-modules-table,
          .course-modules-table tbody,
          .course-modules-table tr,
          .course-modules-table td {
            display: block;
            width: 100%;
          }

          .course-modules-table thead {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
          }

          .course-modules-table tbody tr {
            margin-bottom: 0.875rem;
            border: 1px solid #dee2e6;
            border-radius: 0.5rem;
            overflow: hidden;
          }

          .course-modules-table tbody tr:last-child {
            margin-bottom: 0;
          }

          .course-modules-table tbody td {
            display: grid;
            grid-template-columns: minmax(6.5rem, 35%) minmax(0, 1fr);
            gap: 0.75rem;
            align-items: center;
            padding: 0.75rem !important;
            text-align: left !important;
            border: 0 !important;
            border-top: 1px solid #dee2e6 !important;
          }

          .course-modules-table tbody td:first-child {
            border-top: 0 !important;
          }

          .course-modules-table tbody td::before {
            content: attr(data-label);
            color: #6c757d;
            font-size: 0.75rem;
            font-weight: 700;
            letter-spacing: 0.02em;
            text-transform: uppercase;
          }

          .course-modules-table__actions > div {
            min-width: 0;
          }

          .view-course-modal__footer,
          .view-course-modal__footer > div {
            width: 100%;
          }

          .view-course-modal__footer > div > .btn,
          .view-course-modal__footer > .btn {
            flex: 1 1 auto;
            justify-content: center;
            margin-right: 0 !important;
          }
        }

        @media (max-width: 374.98px) {
          .course-modules-table tbody td {
            grid-template-columns: 1fr;
            gap: 0.25rem;
          }

          .view-course-module-toolbar > div,
          .view-course-modal__footer > div {
            flex-direction: column;
          }

          .view-course-module-toolbar .btn,
          .view-course-modal__footer .btn {
            width: 100%;
          }
        }
      `}</style>
      {/* --- Course Modal --- */}
      <div className="view-course-modal modal show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-xl modal-fullscreen-sm-down">
          <div className="modal-content rounded-3 shadow">
            <div className="modal-header bg-light">
              <h5 className="modal-title fw-bold text-dark">
                {course.title} — Details
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                title="Close course details"
                aria-label="Close course details"
              ></button>
            </div>

            <div className="modal-body text-dark">


              {/* --- Course Details --- */}
              <div className="mb-3"><strong>Description:</strong> {course.description}</div>
              <div className="mb-2"><strong>Type:</strong> {course.course_type}</div>
              <div className="mb-2"><strong>Duration:</strong> {course.duration || "-"}</div>
              <div className="mb-2">
                <strong>Expiry Time Frame:</strong>{" "}
                {course.expiry_months ? `${course.expiry_months} months` : "-"}
              </div>
              <div className="mb-2"><strong>Created By:</strong> {creatorName}</div>

              <hr />

                  {/* --- Modules Section --- */}
                {canManage && (
                  <div className="view-course-module-toolbar d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                    <h5 className="fw-bold mb-0">Modules</h5>

                    <div className="d-flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="btn btn-primary btn-sm d-inline-flex align-items-center gap-1"
                        onClick={openEnrollModal}
                        title="Enroll a student in this course"
                      >
                        <i className="ph ph-user-plus" aria-hidden="true"></i>
                        <span>Enroll Student</span>
                      </button>

                      <button
                        type="button"
                        className="btn btn-danger btn-sm d-inline-flex align-items-center gap-1"
                        onClick={() => setShowAddModule(true)}
                        title="Add a module to this course"
                      >
                        <i className="ph ph-plus-circle" aria-hidden="true"></i>
                        <span>Add Module</span>
                      </button>
                    </div>
                  </div>
                )}

              {modules.length > 0 ? (
                <div className="course-modules-table-wrapper table-responsive">
                <table className="course-modules-table table table-striped table-bordered align-middle">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Order</th>
                       <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modules.map((m, index) => (
                      <tr key={m.id}>
                        <td data-label="#" style={{ color: "#000", backgroundColor: "#fff" }}>{index + 1}</td>
                        <td data-label="Title" style={{ color: "#000", backgroundColor: "#fff" }}>{m.title}</td>
                        <td data-label="Description" style={{ color: "#000", backgroundColor: "#fff" }}>{m.description}</td>
                        <td data-label="Order" style={{ color: "#000", backgroundColor: "#fff" }}>{m.order}</td>
                          <td data-label="Status" style={{ color: "#000", backgroundColor: "#fff" }}>
                            {m.progress_status === "completed" ? (
                              <span className="badge bg-success">Completed</span>
                            ) : m.progress_status === "failed" ? (
                              <span className="badge bg-danger">Failed</span>
                            ) : m.progress_status === "in_progress" ? (
                              <span className="badge bg-warning text-dark">Attempted</span>
                            ) : (
                              <span className="badge bg-secondary">Not Attempted</span>
                            )}
                          </td>
                        <td data-label="Actions" className="course-modules-table__actions">
                          <div className="d-flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="btn btn-success btn-sm d-inline-flex align-items-center justify-content-center p-0"
                            style={{ width: "40px", height: "40px", minWidth: "40px" }}
                            onClick={() => setSelectedModule(m)} // Launch module
                            title="Launch module"
                            aria-label={`Launch ${m.title}`}
                          >
                            <i
                              className="ph ph-play-circle"
                              aria-hidden="true"
                              style={{ fontSize: "18px" }}
                            ></i>
                          </button>
                        {canManage &&(
                          <>

                           <button
                            type="button"
                            className="btn btn-warning btn-sm d-inline-flex align-items-center justify-content-center p-0"
                            style={{ width: "40px", height: "40px", minWidth: "40px" }}
                            onClick={() => {
                              setSelectedModule(m);
                              setShowEditModule(true);
                            }}
                            title="Edit module"
                            aria-label={`Edit ${m.title}`}
                          >
                            <i
                              className="ph ph-pencil-simple"
                              aria-hidden="true"
                              style={{ fontSize: "18px" }}
                            ></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm d-inline-flex align-items-center justify-content-center p-0"
                            style={{ width: "40px", height: "40px", minWidth: "40px" }}
                            onClick={() => handleDeleteModule(m.id)}
                            title="Delete module"
                            aria-label={`Delete ${m.title}`}
                          >
                            <i
                              className="ph ph-trash"
                              aria-hidden="true"
                              style={{ fontSize: "18px" }}
                            ></i>
                          </button>
                          </>
                          )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              ) : (
                <p className="text-muted">No modules added yet.</p>
              )}
            </div>

            <div className="view-course-modal__footer modal-footer d-flex flex-wrap justify-content-between gap-2">
              { canManage &&(<div className="d-flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn btn-warning me-2 d-inline-flex align-items-center gap-1"
                  onClick={onEdit}
                  title="Edit course details"
                >
                  <i className="ph ph-pencil-simple" aria-hidden="true"></i>
                  <span>Edit Course</span>
                </button>
                <button
                  type="button"
                  className="btn btn-danger d-inline-flex align-items-center gap-1"
                  onClick={() => onDelete(course.id)}
                  title="Delete this course"
                >
                  <i className="ph ph-trash" aria-hidden="true"></i>
                  <span>Delete Course</span>
                </button>
              </div> )}
              <button
                type="button"
                className="btn btn-secondary d-inline-flex align-items-center gap-1"
                onClick={onClose}
                title="Close course details"
              >
                <i className="ph ph-x" aria-hidden="true"></i>
                <span>Close</span>
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
                    title="Close edit module form"
                    aria-label="Close edit module form"
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
                  <button
                    type="submit"
                    className="btn btn-success d-inline-flex align-items-center gap-1"
                    title="Save module changes"
                  >
                    <i className="ph ph-floppy-disk" aria-hidden="true"></i>
                    <span>Save Changes</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary d-inline-flex align-items-center gap-1"
                    onClick={() => setShowEditModule(false)}
                    title="Cancel editing"
                  >
                    <i className="ph ph-x" aria-hidden="true"></i>
                    <span>Cancel</span>
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
          onClose={() => {
            setSelectedModule(null);
            fetchModules();
          }}
          onDelete={handleDeleteModule}
          onEdit={() => setShowEditModule(true)}
          onProgressUpdate={fetchModules}
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
                    title="Close enrollment form"
                    aria-label="Close enrollment form"
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
                    className="btn btn-success d-inline-flex align-items-center gap-1"
                    disabled={enrolling}
                    title="Enroll the selected student"
                  >
                    <i className="ph ph-user-plus" aria-hidden="true"></i>
                    <span>{enrolling ? "Enrolling..." : "Enroll"}</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary d-inline-flex align-items-center gap-1"
                    onClick={() => setShowEnrollModal(false)}
                    disabled={enrolling}
                    title="Cancel enrollment"
                  >
                    <i className="ph ph-x" aria-hidden="true"></i>
                    <span>Cancel</span>
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