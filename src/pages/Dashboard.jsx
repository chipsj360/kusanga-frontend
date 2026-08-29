import { useEffect, useMemo, useState } from "react";
import PageTitle from "../components/PageTitle";
import API from "../api";

const COLORS = ["#dc3545", "#198754", "#0d6efd", "#ffc107", "#6f42c1", "#0dcaf0"];
const asList = (value) =>
  Array.isArray(value) ? value : Array.isArray(value?.results) ? value.results : [];

const statusLabel = (status) =>
  ({
    compliant: "Compliant",
    non_compliant: "Not compliant",
    competent: "Competent",
    not_competent: "Not competent",
  })[status] || status || "Unknown";

const StatCard = ({ label, value, helper, icon, tone = "primary" }) => (
  <div className="col-12 col-sm-6 col-xl-3">
    <div className="card h-100 border-0 shadow-sm">
      <div className="card-body d-flex justify-content-between gap-3">
        <div>
          <p className="text-muted small fw-semibold mb-1">{label}</p>
          <h3 className="fw-bold mb-1">{value}</h3>
          <small className="text-muted">{helper}</small>
        </div>
        <span className={`dashboard-stat-icon bg-${tone}-subtle text-${tone}`}>
          <i className={`ph ${icon}`} aria-hidden="true" />
        </span>
      </div>
    </div>
  </div>
);

const BarChart = ({ title, subtitle, data, suffix = "" }) => {
  const max = Math.max(...data.map((item) => Number(item.value) || 0), 1);
  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body">
        <h5 className="fw-bold mb-1">{title}</h5>
        <p className="text-muted small mb-4">{subtitle}</p>
        {data.length ? (
          <div className="dashboard-bars" role="img" aria-label={title}>
            {data.map((item, index) => (
              <div key={`${item.label}-${index}`}>
                <div className="d-flex justify-content-between gap-3 small mb-1">
                  <span className="text-truncate" title={item.label}>{item.label}</span>
                  <strong>{item.value}{suffix}</strong>
                </div>
                <div className="progress" style={{ height: 12 }}>
                  <div
                    className="progress-bar"
                    style={{
                      width: `${Math.max((item.value / max) * 100, item.value ? 3 : 0)}%`,
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : <p className="text-muted mb-0">No data available yet.</p>}
      </div>
    </div>
  );
};

const DonutChart = ({ title, subtitle, data }) => {
  const total = data.reduce((sum, item) => sum + (Number(item.value) || 0), 0);
  let used = 0;
  const gradient = total
    ? `conic-gradient(${data.map((item, index) => {
        const start = (used / total) * 100;
        used += item.value;
        return `${COLORS[index % COLORS.length]} ${start}% ${(used / total) * 100}%`;
      }).join(", ")})`
    : "#e9ecef";

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body">
        <h5 className="fw-bold mb-1">{title}</h5>
        <p className="text-muted small mb-3">{subtitle}</p>
        {total ? (
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-4">
            <div className="dashboard-donut" style={{ background: gradient }} role="img" aria-label={title}>
              <div className="dashboard-donut-hole"><strong>{total}</strong><small>Total</small></div>
            </div>
            <div className="dashboard-legend">
              {data.map((item, index) => (
                <div className="d-flex align-items-center justify-content-between gap-4 mb-2" key={item.label}>
                  <span className="d-flex align-items-center gap-2">
                    <span className="dashboard-legend-dot" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    {item.label}
                  </span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        ) : <p className="text-muted mb-0">No data available yet.</p>}
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState({
    user: null,
    role: localStorage.getItem("role") || "student",
    users: [], departments: [], courses: [], enrollments: [], records: [], modules: [],
  });

  const loadDashboard = async (initial = false) => {
    initial ? setLoading(true) : setRefreshing(true);
    const getList = async (url) => {
      try {
        return asList((await API.get(url)).data);
      } catch (error) {
        console.error(`Dashboard request failed for ${url}:`, error.response?.data || error);
        return [];
      }
    };

    try {
      let user = null;
      try {
        const response = await API.get("/api/auth/user/");
        user = response.data.user ?? response.data;
      } catch (error) {
        console.error("Unable to load dashboard user:", error.response?.data || error);
      }
      const role = user?.role || localStorage.getItem("role") || "student";
      const privileged = role === "admin" || role === "trainer";
      const [courses, enrollments, records, modules, users, departments] = await Promise.all([
        getList("/api/courses/"),
        getList("/api/enrollments/"),
        getList("/api/training-records/"),
        role === "student" ? getList("/api/modules/") : [],
        privileged ? getList("/api/users/") : [],
        privileged ? getList("/api/departments/") : [],
      ]);
      setData({ user, role, users, departments, courses, enrollments, records, modules });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadDashboard(true); }, []);

  const view = useMemo(() => {
    const { role, users, departments, courses, enrollments, records, modules } = data;
    const completed = enrollments.filter((item) => item.completed).length;
    const active = Math.max(enrollments.length - completed, 0);
    const positive = records.filter((item) => ["compliant", "competent"].includes(item.status)).length;
    const validRate = records.length ? Math.round((positive / records.length) * 100) : 0;
    const now = Date.now();
    const limit = now + 30 * 86400000;
    const expiring = records.filter((item) => {
      const expiry = item.expires_on ? new Date(item.expires_on).getTime() : 0;
      return expiry > now && expiry <= limit;
    });
    const statusCounts = records.reduce((result, item) => {
      result[item.status] = (result[item.status] || 0) + 1;
      return result;
    }, {});
    const statusData = Object.entries(statusCounts).map(([label, value]) => ({
      label: statusLabel(label), value,
    }));

    if (role === "admin") {
      const roleData = ["student", "trainer", "admin"].map((item) => ({
        label: item[0].toUpperCase() + item.slice(1),
        value: users.filter((user) => user.role === item).length,
      }));
      const departmentData = departments
        .map((item) => ({ label: item.name, value: Number(item.user_count) || 0 }))
        .sort((a, b) => b.value - a.value).slice(0, 8);
      return {
        heading: "Administration overview",
        description: "Organization-wide learning, staffing and compliance indicators.",
        stats: [
          ["Users", users.length, "All registered users", "ph-users", "primary"],
          ["Departments", departments.length, "Organizational units", "ph-buildings", "info"],
          ["Courses", courses.length, "Available courses", "ph-books", "warning"],
          ["Current compliance", `${validRate}%`, `${positive} of ${records.length} valid records`, "ph-shield-check", validRate >= 80 ? "success" : "danger"],
        ],
        bar: ["Users by department", "Registered users across the largest departments.", departmentData],
        donut: ["Users by role", "Composition of the learning platform audience.", roleData],
        expiring,
      };
    }

    if (role === "trainer") {
      const courseCounts = enrollments.reduce((result, item) => {
        const title = item.course_title || courses.find((course) => course.id === item.course)?.title || "Unknown course";
        result[title] = (result[title] || 0) + 1;
        return result;
      }, {});
      const courseData = Object.entries(courseCounts).map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value).slice(0, 8);
      const learners = new Set(enrollments.map((item) => item.user || item.user_detail?.id).filter(Boolean)).size;
      const completionRate = enrollments.length ? Math.round((completed / enrollments.length) * 100) : 0;
      return {
        heading: "Trainer overview",
        description: "Course reach, learner completion and current training outcomes.",
        stats: [
          ["Courses", courses.length, "Courses available to manage", "ph-books", "primary"],
          ["Learners", learners, "Unique enrolled learners", "ph-student", "info"],
          ["Completion rate", `${completionRate}%`, `${completed} completed enrollments`, "ph-check-circle", "success"],
          ["Expiring in 30 days", expiring.length, "Records requiring attention", "ph-clock-countdown", expiring.length ? "danger" : "success"],
        ],
        bar: ["Enrollments by course", "Learner distribution across the most assigned courses.", courseData],
        donut: ["Training record status", "Current competence and compliance outcomes.", statusData],
        expiring,
      };
    }

    const moduleGroups = modules.reduce((result, item) => {
      const title = item.course_title || courses.find((course) => course.id === item.course)?.title || "Unknown course";
      result[title] ||= { total: 0, completed: 0 };
      result[title].total += 1;
      if (item.progress_status === "completed") result[title].completed += 1;
      return result;
    }, {});
    const progress = Object.entries(moduleGroups).map(([label, item]) => ({
      label, value: item.total ? Math.round((item.completed / item.total) * 100) : 0,
    }));
    return {
      heading: "My learning dashboard",
      description: "Your course progress, achievements and upcoming renewal dates.",
      stats: [
        ["My courses", enrollments.length || courses.length, "Assigned learning courses", "ph-books", "primary"],
        ["Completed", completed, "Completed course enrollments", "ph-check-circle", "success"],
        ["Current records", positive, "Competent or compliant", "ph-certificate", "info"],
        ["Expiring in 30 days", expiring.length, "Renewals coming up", "ph-clock-countdown", expiring.length ? "warning" : "success"],
      ],
      bar: ["Progress by course", "Completed modules as a percentage of each course.", progress, "%"],
      donut: ["Course completion", "Your completed and active course enrollments.", [
        { label: "Completed", value: completed },
        { label: "In progress", value: active },
      ]],
      expiring,
    };
  }, [data]);

  const name = data.user?.full_name || data.user?.username || "User";

  return (
    <>
      <PageTitle title="Dashboard" />
      <style>{`
        .dashboard-stat-icon { width: 48px; height: 48px; border-radius: 14px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .dashboard-stat-icon i { font-size: 1.5rem; }
        .dashboard-bars { display: grid; gap: 1.15rem; }
        .dashboard-donut { width: 180px; height: 180px; border-radius: 50%; padding: 20px; flex: 0 0 180px; }
        .dashboard-donut-hole { width: 100%; height: 100%; border-radius: 50%; background: white; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .dashboard-donut-hole strong { font-size: 1.5rem; }
        .dashboard-legend { min-width: 190px; }
        .dashboard-legend-dot { width: 11px; height: 11px; border-radius: 50%; flex-shrink: 0; }
        @media (max-width: 575.98px) { .dashboard-donut { width: 150px; height: 150px; flex-basis: 150px; } }
      `}</style>
      <div className="container-fluid px-3 px-lg-4 py-3">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
          <div>
            <p className="text-muted mb-1">Welcome back, {name}</p>
            <h2 className="fw-bold mb-1">{view.heading}</h2>
            <p className="text-muted mb-0">{view.description}</p>
          </div>
          <button type="button" className="btn btn-outline-secondary" onClick={() => loadDashboard(false)} disabled={refreshing}>
            <i className="ph ph-arrows-clockwise me-2" />{refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {loading ? (
          <div className="card border-0 shadow-sm"><div className="card-body py-5 text-center text-muted">Loading dashboard statistics...</div></div>
        ) : (
          <>
            <div className="row g-3 mb-4">
              {view.stats.map(([label, value, helper, icon, tone]) => (
                <StatCard key={label} label={label} value={value} helper={helper} icon={icon} tone={tone} />
              ))}
            </div>
            <div className="row g-4 mb-4">
              <div className="col-12 col-xl-7">
                <BarChart title={view.bar[0]} subtitle={view.bar[1]} data={view.bar[2]} suffix={view.bar[3]} />
              </div>
              <div className="col-12 col-xl-5">
                <DonutChart title={view.donut[0]} subtitle={view.donut[1]} data={view.donut[2]} />
              </div>
            </div>
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center gap-2 mb-3">
                  <div><h5 className="fw-bold mb-1">Upcoming expiries</h5><p className="text-muted small mb-0">Records expiring within 30 days.</p></div>
                  <span className="badge bg-warning text-dark">{view.expiring.length} due</span>
                </div>
                {view.expiring.length ? (
                  <div className="table-responsive">
                    <table className="table mb-0">
                      <thead><tr><th>Learner</th><th>Course</th><th>Status</th><th>Expires</th></tr></thead>
                      <tbody>{view.expiring.slice(0, 8).map((record) => (
                        <tr key={record.id}>
                          <td>{record.full_name || record.username || name}</td>
                          <td>{record.course_title || "—"}</td>
                          <td><span className="badge bg-success">{statusLabel(record.status)}</span></td>
                          <td>{new Date(record.expires_on).toLocaleDateString()}</td>
                        </tr>
                      ))}</tbody>
                    </table>
                  </div>
                ) : <p className="text-muted mb-0">No records expire in the next 30 days.</p>}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}