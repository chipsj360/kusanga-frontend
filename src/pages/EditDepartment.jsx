import { useEffect, useState } from "react";
import API from "../api";
import "../assets/css/bootstrap.min.css";
import "../assets/css/adduser.css";

const EditDepartment = ({ department, onClose, onSuccess }) => {
  const [name, setName] = useState(department.name || "");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => setName(department.name || ""), [department]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await API.patch(`/api/departments/${department.id}/`, { name: name.trim() });
      await onSuccess?.();
      onClose();
    } catch (err) {
      const data = err.response?.data;
      const message = data && typeof data === "object"
        ? Object.values(data).flat().join(" ")
        : "Unable to update the department. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog" aria-modal="true">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Edit Department</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="edit-department-name" className="form-label">Department Name</label>
                  <input
                    id="edit-department-name"
                    type="text"
                    className="form-control text-dark bg-white"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    maxLength={200}
                    autoFocus
                    required
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-warning" disabled={isSubmitting || !name.trim()}>
                {isSubmitting ? "Updating..." : "Update"}
              </button>
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditDepartment;
