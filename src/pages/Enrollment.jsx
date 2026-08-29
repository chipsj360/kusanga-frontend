import API from "../api";
import PageTitle from "../components/PageTitle";
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
   <>
    <PageTitle title="Enrollments" />
      <style>{`
        .enrollment-group__toggle {
          min-width: 0;
        }

        .enrollment-group__identity {
          min-width: 0;
        }

        .enrollment-group__identity > div {
          min-width: 0;
        }

        .enrollment-group__name,
        .enrollment-group__email,
        .enrollment-table td {
          overflow-wrap: anywhere;
          word-break: break-word;
        }

        .enrollment-group__count {
          flex-shrink: 0;
          white-space: nowrap;
        }

        .enrollment-table th,
        .enrollment-table td {
          vertical-align: middle;
        }

        .enrollment-table__unenroll {
          display: inline-flex;
          width: 2.25rem;
          height: 2.25rem;
          align-items: center;
          justify-content: center;
          padding: 0;
        }

        @media (max-width: 767.98px) {
          .enrollment-group__toggle {
            align-items: flex-start !important;
            flex-wrap: wrap;
            padding: 0.875rem !important;
          }

          .enrollment-group__identity {
            flex: 1 1 calc(100% - 2rem);
          }

          .enrollment-group__count {
            margin-left: 1.5rem;
          }

          .enrollment-table-wrapper {
            overflow-x: visible;
            padding: 0.75rem;
          }

          .enrollment-table,
          .enrollment-table tbody,
          .enrollment-table tr,
          .enrollment-table td {
            display: block;
            width: 100%;
          }

          .enrollment-table thead {
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

          .enrollment-table tbody tr {
            margin-bottom: 0.75rem;
            border: 1px solid #dee2e6;
            border-radius: 0.5rem;
            overflow: hidden;
          }

          .enrollment-table tbody tr:last-child {
            margin-bottom: 0;
          }

          .enrollment-table tbody td {
            display: grid;
            grid-template-columns: minmax(6.5rem, 38%) minmax(0, 1fr);
            gap: 0.75rem;
            align-items: center;
            padding: 0.75rem !important;
            text-align: left !important;
            border-top: 1px solid #dee2e6;
          }

          .enrollment-table tbody td:first-child {
            border-top: 0;
          }

          .enrollment-table tbody td::before {
            content: attr(data-label);
            color: #6c757d;
            font-size: 0.75rem;
            font-weight: 700;
            letter-spacing: 0.02em;
            text-transform: uppercase;
          }

          .enrollment-table__action .enrollment-table__unenroll {
            justify-self: start;
          }
        }

        @media (max-width: 374.98px) {
          .enrollment-table tbody td {
            grid-template-columns: 1fr;
            gap: 0.25rem;
          }
        }
      `}</style>
      <div className="container mt-4 mb-5 p-5">
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
              className="btn btn-secondary"
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
                className="enrollment-group__toggle bg-light border-0 px-3 py-3 w-100 d-flex justify-content-between align-items-center gap-3 text-start"
                onClick={() => toggleUserEnrollments(userKey)}
                aria-expanded={!isCollapsed}
                aria-controls={panelId}
              >
                <div className="enrollment-group__identity d-flex align-items-center gap-2">
                  <span aria-hidden="true" style={{ width: "1rem" }}>
                    {isCollapsed ? "▸" : "▾"}
                  </span>
                  <div>
                    <div className="enrollment-group__name fw-semibold">
                      {user.full_name || user.username || "Unknown student"}
                    </div>
                    <small className="enrollment-group__email text-muted d-block">
                      {user.email || "No email available"}
                    </small>
                  </div>
                </div>
                <span
                  className="enrollment-group__count badge text-dark rounded-0"
                  style={{ backgroundColor: "#e5e5e5" }}
                >
                  {group.enrollments.length} {group.enrollments.length === 1 ? "Enrollment" : "Enrollments"}
                </span>
              </button>

              <div
                id={panelId}
                className="enrollment-table-wrapper table-responsive"
                hidden={isCollapsed}
              >
                <table className="enrollment-table table align-middle mb-0">
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
                        <td data-label="#" className="ps-3 text-muted">{index + 1}</td>
                        <td data-label="Course">
                          {enrollment.course_title || enrollment.course || "—"}
                        </td>
                        <td data-label="Enrolled at">
                          {enrollment.enrolled_at
                            ? new Date(enrollment.enrolled_at).toLocaleDateString()
                            : "—"}
                        </td>
                        <td data-label="Status">
                          {enrollment.completed ? "Completed" : "In progress"}
                        </td>
                        <td data-label="Action" className="enrollment-table__action text-end pe-3">
                          <button
                            type="button"
                            className="enrollment-table__unenroll btn btn-danger btn-sm rounded-0 m-3"
                            onClick={() => handleUnenroll(enrollment.id)}
                            aria-label={`Unenroll ${user.full_name || user.username || "student"}`}
                            title="Unenroll student"
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <circle cx="9" cy="7" r="4" />
                              <path d="M3 21v-2a6 6 0 0 1 6-6h2" />
                              <path d="M16 17h6" />
                            </svg>
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
   </>
  );
};

export default Enrollment;