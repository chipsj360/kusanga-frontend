import API from "../api";
import { useEffect, useState } from "react";

const Enrollment = () => {
  const role = localStorage.getItem("role");
  const canManage = role === "trainer" || role === "admin";

  const [enrollments, setEnrollments] = useState([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);
  const [unenrollError, setUnenrollError] = useState("");

  const fetchEnrollments = async () => {
    if (!canManage) return;
    setLoadingEnrollments(true);
    setUnenrollError("");

    try {
      // ✅ fetch ALL enrollments (trainer/admin only page)
      const res = await API.get("/api/enrollments/");
      setEnrollments(res.data || []);
    } catch (err) {
      console.error("Error fetching enrollments:", err);
      setUnenrollError("Failed to load enrolled students.");
    } finally {
      setLoadingEnrollments(false);
    }
  };

  const handleUnenroll = async (enrollmentId) => {
    if (!window.confirm("Unenroll this student from the course?")) return;

    try {
      await API.delete(`/api/enrollments/${enrollmentId}/`);
      setEnrollments((prev) => prev.filter((e) => e.id !== enrollmentId));
    } catch (err) {
      console.error("Unenroll error:", err?.response?.data || err);
      setUnenrollError(err?.response?.data?.detail || "Failed to unenroll student.");
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  if (!canManage) return <div className="container mt-4">Access denied.</div>;

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="fw-bold mb-0">Enrollments</h5>
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
                <th>Student</th>
                <th>Email</th>
                <th>Course</th>
                <th>Enrolled At</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {enrollments.map((enr, idx) => {
                // if your serializer returns user_detail/course_detail, this will work
                const u = enr.user_detail || {};
                const c = enr.course_detail || {};

                return (
                  <tr key={enr.id}>
                    <td>{idx + 1}</td>
                    <td>{u.full_name || u.username || "—"}</td>
                    <td>{u.email || "—"}</td>
                    <td>{enr.course_title || enr.course || "—"}</td>
                    <td>{enr.enrolled_at ? new Date(enr.enrolled_at).toLocaleDateString() : "—"}</td>
                    <td>{enr.due_date ? new Date(enr.due_date).toLocaleDateString() : "—"}</td>
                    <td>{enr.completed ? "Completed" : "In progress"}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleUnenroll(enr.id)}>
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
        <p className="text-muted">No enrollments found.</p>
      )}
    </div>
  );
};

export default Enrollment;
