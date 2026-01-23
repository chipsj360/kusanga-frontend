import { useEffect, useState } from "react";
import API from "../api";

const CourseGroups = () => {
  const role = localStorage.getItem("role");
  const canManage = role === "trainer" || role === "admin";

  const [groups, setGroups] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);

  const [selectedGroup, setSelectedGroup] = useState(null);

  // create group
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // edit group courses
  const [groupCourseIds, setGroupCourseIds] = useState([]);

  // assign
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [dueDate, setDueDate] = useState(""); // YYYY-MM-DD

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!canManage) {
    return <div className="container mt-4">Access denied.</div>;
  }

  const fetchAll = async () => {
    setError("");
    try {
      const [gRes, cRes, uRes] = await Promise.all([
        API.get("/api/course-groups/"),
        API.get("/api/courses/"),     // trainer/admin sees all
        API.get("/api/users/"),
      ]);

      setGroups(gRes.data || []);
      setCourses(cRes.data || []);
      setStudents((uRes.data || []).filter((u) => u.role === "student"));
    } catch (err) {
      console.error(err);
      setError("Failed to load groups/courses/users.");
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const openGroup = (g) => {
    setSelectedGroup(g);
    setGroupCourseIds(g.courses || []);
    setSelectedStudentIds([]);
    setDueDate("");
    setSuccess("");
    setError("");
  };

  const createGroup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await API.post("/api/course-groups/", {
        name,
        description,
        courses: [],
      });

      setName("");
      setDescription("");
      setGroups((prev) => [res.data, ...prev]);
      setSuccess("Group created.");
    } catch (err) {
      console.error(err?.response?.data || err);
      setError(err?.response?.data?.detail || "Failed to create group.");
    }
  };

  const toggleCourseInGroup = (courseId) => {
    setGroupCourseIds((prev) =>
      prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]
    );
  };

  const saveGroupCourses = async () => {
    if (!selectedGroup) return;
    setError("");
    setSuccess("");

    try {
      const res = await API.patch(`/api/course-groups/${selectedGroup.id}/`, {
        courses: groupCourseIds,
      });

      // update local group list
      setGroups((prev) => prev.map((g) => (g.id === res.data.id ? res.data : g)));
      setSelectedGroup(res.data);
      setSuccess("Group courses updated.");
    } catch (err) {
      console.error(err?.response?.data || err);
      setError("Failed to update group courses.");
    }
  };

  const toggleStudent = (userId) => {
    setSelectedStudentIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const assignGroup = async () => {
    if (!selectedGroup) return;
    if (!selectedStudentIds.length) {
      setError("Select at least one student.");
      return;
    }

    setError("");
    setSuccess("");

    try {
      const payload = {
        user_ids: selectedStudentIds,
        due_date: dueDate ? `${dueDate}T00:00:00Z` : null,
      };

      const res = await API.post(`/api/course-groups/${selectedGroup.id}/assign/`, payload);
      setSuccess(
        `Assigned group. Created enrollments: ${res.data.created_enrollments}, new group links: ${res.data.created_group_links}`
      );
    } catch (err) {
      console.error(err?.response?.data || err);
      setError(err?.response?.data?.detail || "Failed to assign group.");
    }
  };

  const unassignGroupFromStudent = async (userId, removeEnrollments = false) => {
    if (!selectedGroup) return;
    if (!window.confirm("Unassign this group from the student?")) return;

    setError("");
    setSuccess("");

    try {
      const res = await API.post(`/api/course-groups/${selectedGroup.id}/unassign/`, {
        user_id: userId,
        remove_enrollments: removeEnrollments,
      });
      setSuccess(`Unassigned. Removed enrollments: ${res.data.removed_enrollments}`);
    } catch (err) {
      console.error(err?.response?.data || err);
      setError(err?.response?.data?.detail || "Failed to unassign.");
    }
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center">
        <h3>Course Groups</h3>
        <button className="btn btn-outline-secondary btn-sm" onClick={fetchAll}>
          Refresh
        </button>
      </div>

      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {success && <div className="alert alert-success mt-3">{success}</div>}

      <div className="row mt-3">
        {/* LEFT: Create + Group list */}
        <div className="col-md-4">
          <div className="card mb-3">
            <div className="card-header fw-bold">Create Group</div>
            <div className="card-body">
              <form onSubmit={createGroup}>
                <div className="mb-2">
                  <label className="form-label">Name</label>
                  <input
                    className="form-control text-dark bg-white"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control text-dark bg-white"
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <button className="btn btn-primary w-100">Create</button>
              </form>
            </div>
          </div>

          <div className="card">
            <div className="card-header fw-bold">Groups</div>
            <div className="list-group list-group-flush" style={{ maxHeight: 420, overflowY: "auto" }}>
              {groups.map((g) => (
                <button
                  key={g.id}
                  className={`list-group-item list-group-item-action ${selectedGroup?.id === g.id ? "active" : ""}`}
                  onClick={() => openGroup(g)}
                >
                  <div className="fw-semibold">{g.name}</div>
                  <small className="opacity-75">{(g.courses || []).length} course(s)</small>
                </button>
              ))}
              {!groups.length && <div className="p-3 text-muted">No groups yet.</div>}
            </div>
          </div>
        </div>

        {/* RIGHT: Group editor */}
        <div className="col-md-8">
          {!selectedGroup ? (
            <div className="card">
              <div className="card-body text-muted">Select a group to manage its courses and assignments.</div>
            </div>
          ) : (
            <>
              {/* Group courses */}
              <div className="card mb-3">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <div className="fw-bold">Group Courses — {selectedGroup.name}</div>
                  <button className="btn btn-success btn-sm" onClick={saveGroupCourses}>
                    Save Courses
                  </button>
                </div>
                <div className="card-body" style={{ maxHeight: 300, overflowY: "auto" }}>
                  {courses.map((c) => (
                    <div className="form-check" key={c.id}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`course-${c.id}`}
                        checked={groupCourseIds.includes(c.id)}
                        onChange={() => toggleCourseInGroup(c.id)}
                      />
                      <label className="form-check-label" htmlFor={`course-${c.id}`}>
                        <span className="fw-semibold">{c.title}</span>{" "}
                        <small className="text-muted">({c.course_type})</small>
                      </label>
                    </div>
                  ))}
                  {!courses.length && <div className="text-muted">No courses found.</div>}
                </div>
              </div>

              {/* Assign group */}
              <div className="card mb-3">
                <div className="card-header fw-bold">Assign Group to Students</div>
                <div className="card-body">
                  <div className="row g-2 align-items-end">
                    <div className="col-md-4">
                      <label className="form-label">Due Date (optional)</label>
                      <input
                        type="date"
                        className="form-control"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                      />
                    </div>
                    <div className="col-md-8 d-flex justify-content-end">
                      <button className="btn btn-primary" onClick={assignGroup}>
                        Assign to Selected ({selectedStudentIds.length})
                      </button>
                    </div>
                  </div>

                  <hr />

                  <div style={{ maxHeight: 260, overflowY: "auto" }} className="border rounded p-2">
                    {students.map((s) => (
                      <div className="form-check py-1" key={s.id}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`student-${s.id}`}
                          checked={selectedStudentIds.includes(s.id)}
                          onChange={() => toggleStudent(s.id)}
                        />
                        <label className="form-check-label" htmlFor={`student-${s.id}`}>
                          <span className="fw-semibold">{s.full_name || s.username}</span>
                          {s.email ? <span className="text-muted"> — {s.email}</span> : null}
                        </label>
                      </div>
                    ))}
                    {!students.length && <div className="text-muted">No students found.</div>}
                  </div>

                  <small className="text-muted d-block mt-2">
                    Assigning a group automatically creates <b>Enrollment</b> records for each course in the group.
                  </small>
                </div>
              </div>

              {/* Unassign helper (manual) */}
              <div className="card">
                <div className="card-header fw-bold">Unassign Group (Quick)</div>
                <div className="card-body">
                  <p className="text-muted mb-2">
                    Use this to unassign a group from a student. By default, we keep enrollments to preserve progress.
                  </p>

                  <div style={{ maxHeight: 220, overflowY: "auto" }} className="border rounded p-2">
                    {students.map((s) => (
                      <div key={s.id} className="d-flex justify-content-between align-items-center py-1">
                        <div>
                          <span className="fw-semibold">{s.full_name || s.username}</span>
                          {s.email ? <small className="text-muted"> — {s.email}</small> : null}
                        </div>
                        <div>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => unassignGroupFromStudent(s.id, false)}
                          >
                            Unassign
                          </button>
                        </div>
                      </div>
                    ))}
                    {!students.length && <div className="text-muted">No students found.</div>}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseGroups;
