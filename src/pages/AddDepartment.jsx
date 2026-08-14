import { useState } from "react";
import API from "../api";
import "../assets/css/bootstrap.min.css";
import "../assets/css/adduser.css";

const getErrorMessage = (error, fallback) => {
  const data = error.response?.data;
  if (!data || typeof data !== "object") return fallback;
  return Object.entries(data)
    .map(([field, messages]) =>
      `${field === "detail" ? "" : `${field}: `}${Array.isArray(messages) ? messages.join(" ") : messages}`
    )
    .join("\n");
};

const AddDepartment = ({ onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await API.post("/api/departments/", { name: name.trim() });
      await onSuccess?.();
      onClose();
    } catch (err) {
      setError(getErrorMessage(err, "Unable to add the department. Please try again."));
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
              <h5 className="modal-title">Add New Department</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-danger" style={{ whiteSpace: "pre-line" }}>{error}</div>}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="department-name" className="form-label">Department Name</label>
                  <input
                    id="department-name"
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
              <button type="submit" className="btn btn-primary" disabled={isSubmitting || !name.trim()}>
                {isSubmitting ? "Saving..." : "Save"}
              </button>
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDepartment;
