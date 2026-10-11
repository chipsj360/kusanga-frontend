import { useEffect, useState } from "react";
import API from "../api";

const EditUser = ({ user, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    ...user,
    password: "",
    department: user.department?.id ?? user.department ?? "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchDepartments = async () => {
      try {
        const response = await API.get("/api/auth/departments/");
        if (active) setDepartments(Array.isArray(response.data) ? response.data : response.data.results || []);
      } catch (err) {
        console.error("Error fetching departments:", err.response?.data || err);
      } finally {
        if (active) setDepartmentsLoading(false);
      }
    };

    fetchDepartments();
    return () => {
      active = false;
    };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    const payload = {
      full_name: form.full_name,
      username: form.username,
      email: form.email,
      role: form.role,
      job_title: form.job_title || null,
      employee_id: form.employee_id || null,
      department: form.department || null,
    };
    if (form.password !== "") payload.password = form.password;
    try {
      await API.put(`/api/users/${user.id}/`, payload);
      onSuccess?.();
      onClose();
    } catch (err) {
      const responseErrors = err.response?.data;
      setError(responseErrors && typeof responseErrors === "object"
        ? Object.entries(responseErrors).map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(" ") : messages}`).join("\n")
        : "Unable to update the user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Edit User</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-danger" role="alert" style={{ whiteSpace: "pre-line" }}>{error}</div>}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Full Name</label>
                  <input type="text" name="full_name" value={form.full_name || ""} className="form-control" onChange={handleChange} />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="edit-user-username">Username</label>
                  <input id="edit-user-username" type="text" name="username" value={form.username || ""} className="form-control" onChange={handleChange} required />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="edit-user-password">New Password</label>
                  <div className="input-group">
                    <input id="edit-user-password" type={showPassword ? "text" : "password"} name="password" value={form.password} className="form-control" onChange={handleChange} autoComplete="new-password"  />
                    <button type="button" className="btn btn-secondary" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"} title={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} aria-controls="edit-user-password">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                        <circle cx="12" cy="12" r="3" />
                        {showPassword && <path d="m3 3 18 18" />}
                      </svg>
                    </button>
                  </div>
                  <div className="form-text">Leave blank to keep the current password.</div>
                </div>
                <div className="col-md-6 mb-3">
                  <label>Email</label>
                  <input type="email" name="email" value={form.email || ""} className="form-control" onChange={handleChange} />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Role</label>
                  <select name="role" value={form.role} className="form-select" onChange={handleChange}>
                    <option value="student">Student</option>
                    <option value="trainer">Trainer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label>Job Title</label>
                  <input type="text" name="job_title" value={form.job_title || ""} className="form-control" onChange={handleChange} />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Department</label>
                  <select
                    name="department"
                    value={form.department || ""}
                    className="form-select"
                    onChange={handleChange}
                    disabled={departmentsLoading}
                  >
                    <option value="">
                      {departmentsLoading
                        ? "Loading departments..."
                        : "Select Department"}
                    </option>
                    {departments.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label>Employee ID</label>
                  <input type="text" name="employee_id" value={form.employee_id || ""} className="form-control" onChange={handleChange} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-warning" disabled={isSubmitting}>{isSubmitting ? "Updating..." : "Update"}</button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUser;