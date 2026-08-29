import { useEffect, useState } from "react";
import PageTitle from "../components/PageTitle";
import API from "../api";

const TrainingRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [recordTypeFilter, setRecordTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [collapsedUsers, setCollapsedUsers] = useState({});

  const fetchRecords = async () => {
    setLoading(true);

    try {
      const res = await API.get("/api/training-records/");
      setRecords(res.data);
    } catch (err) {
      console.error("Error fetching training records:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const query = searchTerm.trim().toLowerCase();
  const courseOptions = Array.from(
    new Set(records.map((record) => record.course_title).filter(Boolean)),
  ).sort((a, b) => String(a).localeCompare(String(b)));
  const recordTypeOptions = Array.from(
    new Set(records.map((record) => record.course_record_type).filter(Boolean)),
  ).sort((a, b) => String(a).localeCompare(String(b)));
  const statusOptions = Array.from(
    new Set(records.map((record) => record.status).filter(Boolean)),
  ).sort((a, b) => String(a).localeCompare(String(b)));

  const filteredRecords = records.filter((record) => {
    const values = [
      record.full_name,
      record.username,
      record.course_title,
      record.course_record_type,
      record.status,
    ];

    const matchesSearch =
      !query ||
      values.some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(query),
      );
    const matchesCourse = !courseFilter || record.course_title === courseFilter;
    const matchesRecordType =
      !recordTypeFilter || record.course_record_type === recordTypeFilter;
    const matchesStatus = !statusFilter || record.status === statusFilter;

    return matchesSearch && matchesCourse && matchesRecordType && matchesStatus;
  });

  const groupedRecords = filteredRecords.reduce((groups, record) => {
    const userKey =
      record.user_id ||
      record.username ||
      record.full_name ||
      `unknown-user-${record.id}`;

    if (!groups[userKey]) {
      groups[userKey] = {
        fullName: record.full_name,
        username: record.username,
        records: [],
      };
    }

    groups[userKey].records.push(record);
    return groups;
  }, {});

  const toggleUserRecords = (userKey) => {
    setCollapsedUsers((previous) => ({
      ...previous,
      [userKey]: !(previous[userKey] ?? true),
    }));
  };

  const clearFilters = () => {
    setCourseFilter("");
    setRecordTypeFilter("");
    setStatusFilter("");
    setSearchTerm("");
  };

  const formatRecordType = (type) => {
    if (type === "compliance") return "Compliance";
    if (type === "competence") return "Competence";
    return type || "—";
  };

  const formatDate = (date) => (date ? new Date(date).toLocaleString() : "—");

  const isExpired = (record) =>
    record.expires_on && new Date(record.expires_on).getTime() <= Date.now();

  const formatStatus = (status) => {
    const labels = {
      compliant: "Compliant",
      non_compliant: "Not Compliant",
      competent: "Competent",
      not_competent: "Not Competent",
    };
    return labels[status] || status || "Unknown";
  };

  return (
     <>
    <PageTitle title="Training Records" />
    <style>{`
      .training-record-group__toggle,
      .training-record-group__identity,
      .training-record-group__identity > div {
        min-width: 0;
      }

      .training-record-group__name,
      .training-record-group__username,
      .training-record-table td {
        overflow-wrap: anywhere;
        word-break: break-word;
      }

      .training-record-group__count {
        flex-shrink: 0;
        white-space: nowrap;
      }

      .training-record-table th,
      .training-record-table td {
        vertical-align: middle;
      }

      @media (max-width: 767.98px) {
        .training-record-group__toggle {
          align-items: flex-start !important;
          flex-wrap: wrap;
          padding: 0.875rem !important;
        }

        .training-record-group__identity {
          flex: 1 1 calc(100% - 2rem);
        }

        .training-record-group__count {
          margin-left: 1.5rem;
        }

        .training-record-table-wrapper {
          overflow-x: visible;
          padding: 0.75rem;
        }

        .training-record-table,
        .training-record-table tbody,
        .training-record-table tr,
        .training-record-table td {
          display: block;
          width: 100%;
        }

        .training-record-table thead {
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

        .training-record-table tbody tr {
          margin-bottom: 0.75rem;
          border: 1px solid #dee2e6;
          border-radius: 0.5rem;
          overflow: hidden;
        }

        .training-record-table tbody tr:last-child {
          margin-bottom: 0;
        }

        .training-record-table tbody td {
          display: grid;
          grid-template-columns: minmax(7rem, 40%) minmax(0, 1fr);
          gap: 0.75rem;
          align-items: center;
          padding: 0.75rem !important;
          text-align: left !important;
          border-top: 1px solid #dee2e6;
        }

        .training-record-table tbody td:first-child {
          border-top: 0;
        }

        .training-record-table tbody td::before {
          content: attr(data-label);
          color: #6c757d;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }
      }

      @media (max-width: 374.98px) {
        .training-record-table tbody td {
          grid-template-columns: 1fr;
          gap: 0.25rem;
        }
      }
    `}</style>
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0">Training Records</h5>
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={fetchRecords}
        >
          Refresh
        </button>
      </div>

      <div className="rounded p-3 mb-4" style={{ border: "1px solid #edb9b9" }}>
        <div className="row g-3 align-items-end">
          <div className="col-12 col-md-4">
            <label
              htmlFor="training-course-filter"
              className="form-label fw-semibold mb-1"
            >
              Filter by Course
            </label>
            <select
              id="training-course-filter"
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

          <div className="col-12 col-md-3">
            <label
              htmlFor="record-type-filter"
              className="form-label fw-semibold mb-1"
            >
              Record Type
            </label>
            <select
              id="record-type-filter"
              className="form-select"
              value={recordTypeFilter}
              onChange={(e) => setRecordTypeFilter(e.target.value)}
            >
              <option value="">All Record Types</option>
              {recordTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {formatRecordType(type)}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-3">
            <label
              htmlFor="training-status-filter"
              className="form-label fw-semibold mb-1"
            >
              Status
            </label>
            <select
              id="training-status-filter"
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-2 d-grid">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className="mt-3" style={{ width: "100%", maxWidth: "420px" }}>
          <label
            htmlFor="training-record-search"
            className="form-label fw-semibold mb-1"
          >
            Search
          </label>
          <input
            id="training-record-search"
            type="search"
            placeholder="Search training records"
            className="form-control text-dark"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p className="text-muted">Loading training records...</p>
      ) : filteredRecords.length ? (
        Object.entries(groupedRecords).map(([userKey, group]) => {
          const isCollapsed = collapsedUsers[userKey] ?? true;
          const panelId = `training-records-${String(userKey).replace(
            /[^a-zA-Z0-9_-]/g,
            "-",
          )}`;

          return (
            <section
              key={userKey}
              className="rounded mb-4 overflow-hidden"
              style={{ border: "1px solid #edb9b9" }}
            >
              <button
                type="button"
                className="training-record-group__toggle bg-light border-0 px-3 py-3 w-100 d-flex justify-content-between align-items-center gap-3 text-start"
                onClick={() => toggleUserRecords(userKey)}
                aria-expanded={!isCollapsed}
                aria-controls={panelId}
              >
                <div className="training-record-group__identity d-flex align-items-center gap-2">
                  <span aria-hidden="true" style={{ width: "1rem" }}>
                    {isCollapsed ? "▸" : "▾"}
                  </span>
                  <div>
                    <div className="training-record-group__name fw-semibold">
                      {group.fullName || group.username || "Unknown user"}
                    </div>
                    <small className="training-record-group__username text-muted d-block">
                      {group.username || "No username available"}
                    </small>
                  </div>
                </div>
                <span
                  className="training-record-group__count badge text-dark rounded-0"
                  style={{ backgroundColor: "#e5e5e5" }}
                >
                  {group.records.length}{" "}
                  {group.records.length === 1 ? "Record" : "Records"}
                </span>
              </button>

              <div
                id={panelId}
                className="training-record-table-wrapper table-responsive"
                hidden={isCollapsed}
              >
                <table className="training-record-table table align-middle mb-0">
                  <thead>
                    <tr>
                      <th className="ps-3">#</th>
                      <th>Course</th>
                      <th>Record Type</th>
                      <th>Status</th>
                      <th>Achieved On</th>
                      <th className="pe-3">Expires On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.records.map((record, index) => {
                      const expired = isExpired(record);

                      return (
                      <tr key={record.id} className={expired ? "table-danger" : ""}>
                        <td data-label="#" className="ps-3 text-muted">
                          {index + 1}
                        </td>
                        <td data-label="Course">{record.course_title || "—"}</td>
                        <td data-label="Record type">
                          {formatRecordType(record.course_record_type)}
                        </td>
                        <td data-label="Status">
                          <span
                            className={`badge ${
                              expired ||
                              record.status === "non_compliant" ||
                              record.status === "not_competent"
                                ? "bg-danger"
                                : record.status === "compliant" ||
                                    record.status === "competent"
                                ? "bg-success"
                                : "bg-secondary"
                            }`}
                          >
                            {formatStatus(record.status)}
                          </span>
                        </td>
                        <td data-label="Achieved on">
                          {formatDate(record.achieved_on)}
                        </td>
                        <td
                          data-label="Expires on"
                          className={`pe-3 ${expired ? "text-danger fw-bold" : ""}`}
                        >
                          {formatDate(record.expires_on)}
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })
      ) : (
        <p className="text-muted">
          {records.length
            ? "No training records match your search or filters."
            : "No training records found."}
        </p>
      )}
    </div>
     </>
  );
};

export default TrainingRecords;