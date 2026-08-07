import API from "../api";
import { useEffect, useState } from "react";

const Enrollment = () => {
  const role = localStorage.getItem("role");
  const canManage = role === "trainer" || role === "admin";

  const [enrollments, setEnrollments] = useState([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);
  const [unenrollError, setUnenrollError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [collapsedUsers, setCollapsedUsers] = useState({});

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

  const query = searchTerm.trim().toLowerCase();
  const courseOptions = Array.from(
    new Set(
      enrollments
        .map((enrollment) => enrollment.course_title || enrollment.course)
        .filter(Boolean)
    )
  ).sort((a, b) => String(a).localeCompare(String(b)));

  const filteredEnrollments = enrollments.filter((enrollment) => {
    const user = enrollment.user_detail || {};
    const status = enrollment.completed ? "completed" : "in progress";
    const course = enrollment.course_title || enrollment.course || "";
    const values = [
      user.full_name,
      user.username,
      user.email,
      course,
      status,
    ];

    const matchesSearch = !query || values.some((value) =>
      String(value ?? "").toLowerCase().includes(query)
    );
    const matchesCourse =
      !courseFilter || String(course) === courseFilter;
    const matchesStatus =
      !statusFilter || status === statusFilter;

    return matchesSearch && matchesCourse && matchesStatus;
  });

  const groupedEnrollments = filteredEnrollments.reduce((groups, enrollment) => {
    const user = enrollment.user_detail || {};
    const userKey =
      user.id || user.email || user.username || user.full_name || "unknown-user";

    if (!groups[userKey]) {
      groups[userKey] = {
        user,
        enrollments: [],
      };
    }

    groups[userKey].enrollments.push(enrollment);
    return groups;
  }, {});

  const handleClearFilters = () => {
    setCourseFilter("");
    setStatusFilter("");
    setSearchTerm("");
  };

  const toggleUserEnrollments = (userKey) => {
    setCollapsedUsers((previous) => ({
      ...previous,
      [userKey]: !(previous[userKey] ?? true),
    }));
  };

  if (!canManage) return <div className="container mt-4">Access denied.</div>;

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0">Enrollments</h5>
        <button className="btn btn-outline-secondary btn-sm" onClick={fetchEnrollments}>
          Refresh
        </button>
      </div>

      {unenrollError && <div className="alert alert-danger">{unenrollError}</div>}

      <div
        className="rounded p-3 mb-4"
        style={{ border: "1px solid #edb9b9" }}
      >
        <div className="row g-3 align-items-end">
          <div className="col-12 col-md-5">
            <label htmlFor="course-filter" className="form-label fw-semibold mb-1">
              Filter by Course
            </label>
            <select
              id="course-filter"
              className="form-select"
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
            >
              <option value="">All Courses</option>
              {courseOptions.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-5">
            <label htmlFor="status-filter" className="form-label fw-semibold mb-1">
              Status
            </label>
            <select
              id="status-filter"
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="in progress">In progress</option>
            </select>
          </div>

          <div className="col-12 col-md-2 d-grid">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={handleClearFilters}
              disabled={!courseFilter && !statusFilter && !searchTerm}
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className="mt-3" style={{ width: "100%", maxWidth: "420px" }}>
          <label htmlFor="enrollment-search" className="form-label fw-semibold mb-1">
            Search
          </label>
          <input
            id="enrollment-search"
            type="search"
            placeholder="Search enrollments"
            className="form-control text-dark"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loadingEnrollments ? (
        <p className="text-muted">Loading enrollments...</p>
      ) : filteredEnrollments.length ? (
        Object.entries(groupedEnrollments).map(([userKey, group]) => {
          const user = group.user;
          const isCollapsed = collapsedUsers[userKey] ?? true;
          const panelId = `enrollments-${String(userKey).replace(/[^a-zA-Z0-9_-]/g, "-")}`;

          return (
            <section
              key={userKey}
              className="rounded mb-4 overflow-hidden"
              style={{ border: "1px solid #edb9b9" }}
            >
              <button
                type="button"
                className="bg-light border-0 px-3 py-3 w-100 d-flex justify-content-between align-items-center gap-3 text-start"
                onClick={() => toggleUserEnrollments(userKey)}
                aria-expanded={!isCollapsed}
                aria-controls={panelId}
              >
                <div className="d-flex align-items-center gap-2">
                  <span aria-hidden="true" style={{ width: "1rem" }}>
                    {isCollapsed ? "▸" : "▾"}
                  </span>
                  <div>
                    <div className="fw-semibold">
                      {user.full_name || user.username || "Unknown student"}
                    </div>
                    <small className="text-muted">
                      {user.email || "No email available"}
                    </small>
                  </div>
                </div>
                <span
                  className="badge text-dark rounded-0"
                  style={{ backgroundColor: "#e5e5e5" }}
                >
                  {group.enrollments.length} {group.enrollments.length === 1 ? "Enrollment" : "Enrollments"}
                </span>
              </button>

              <div
                id={panelId}
                className="table-responsive"
                hidden={isCollapsed}
              >
                <table className="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th className="ps-3">#</th>
                      <th>Course</th>
                      <th>Enrolled At</th>
                      <th>Status</th>
                      <th className="text-end pe-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.enrollments.map((enrollment, index) => (
                      <tr key={enrollment.id}>
                        <td className="ps-3 text-muted">{index + 1}</td>
                        <td>{enrollment.course_title || enrollment.course || "—"}</td>
                        <td>
                          {enrollment.enrolled_at
                            ? new Date(enrollment.enrolled_at).toLocaleDateString()
                            : "—"}
                        </td>
                        <td>{enrollment.completed ? "Completed" : "In progress"}</td>
                        <td className="text-end pe-3">
                          <button
                            className="btn btn-danger btn-sm rounded-0"
                            onClick={() => handleUnenroll(enrollment.id)}
                          >
                            Unenroll
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })
      ) : (
        <p className="text-muted">
          {enrollments.length
            ? "No enrollments match your search or filters."
            : "No enrollments found."}
        </p>
      )}
    </div>
  );
};

export default Enrollment;