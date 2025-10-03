import { useState } from "react";
import API from "../api";

const EditUser = ({ user, onClose, onSuccess }) => {
  const [form, setForm] = useState({ ...user });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/api/users/${user.id}/`, form);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error updating user");
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
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Full Name</label>
                  <input type="text" name="full_name" value={form.full_name || ""} className="form-control" onChange={handleChange} />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Email</label>
                  <input type="email" name="email" value={form.email || ""} className="form-control" onChange={handleChange} />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Role</label>
                  <select name="role" value={form.role} className="form-select" onChange={handleChange}>
                    <option value="employee">Employee</option>
                    <option value="trainer">Trainer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label>Job Title</label>
                  <input type="text" name="job_title" value={form.job_title || ""} className="form-control" onChange={handleChange} />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Employee ID</label>
                  <input type="text" name="employee_id" value={form.employee_id || ""} className="form-control" onChange={handleChange} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-warning">Update</button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
