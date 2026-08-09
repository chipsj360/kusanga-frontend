import { useState } from "react";
import API from "../api";
import "../assets/css/bootstrap.min.css";
import "../assets/css/adduser.css";

const AddUser = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    full_name: "",
    username: "",
    email: "",
    password: "",
    role: "student",
    job_title: "",
    employee_id: "",
    department: null,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const payload = {
      ...form,
      full_name: form.full_name.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
      job_title: form.job_title.trim() || null,
      employee_id: form.employee_id.trim() || null,
      department: form.department || null,
    };

    try {
      await API.post("/api/auth/register/", payload);
      onSuccess?.();
      onClose();
    } catch (err) {
      const responseErrors = err.response?.data;
      const message = responseErrors && typeof responseErrors === "object"
        ? Object.entries(responseErrors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(" ") : messages}`)
            .join("\n")
        : "Unable to add the user. Please try again.";

      console.error("Registration error:", responseErrors || err);
      setError(message);
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
              <h5 className="modal-title">Add New User</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger" role="alert" style={{ whiteSpace: "pre-line" }}>
                  {error}
                </div>
              )}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Full Name</label>
                  <input type="text" name="full_name" className="form-control text-dark bg-white" onChange={handleChange} required />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Username</label>
                  <input type="text" name="username" className="form-control" onChange={handleChange} required />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Email</label>
                  <input type="email" name="email" className="form-control" onChange={handleChange} required />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Password</label>
                  <input type="password" name="password" className="form-control" onChange={handleChange} required />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Role</label>
                  <select name="role" className="form-select" value={form.role} onChange={handleChange}>
                    <option value="student">Student</option>
                    <option value="trainer">Trainer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label>Job Title</label>
                  <input type="text" name="job_title" className="form-control" onChange={handleChange} />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Employee ID</label>
                  <input type="text" name="employee_id" className="form-control" onChange={handleChange} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save"}
              </button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;