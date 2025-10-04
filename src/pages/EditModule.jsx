// src/pages/EditModule.jsx
import { useState } from "react";
import API from "../api";
import "../assets/css/bootstrap.min.css";

const EditModule = ({ module, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: module.title,
    description: module.description,
    course: module.course, // keep the course ID
    order: module.order,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/api/modules/${module.id}/`, form);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error updating module");
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Edit Module</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>

            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Title</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control text-dark bg-white"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Course</label>
                  <input
                    type="text"
                    className="form-control"
                    value={module.course_title || module.course} // display course title if available
                    readOnly
                  />
                </div>

                <div className="col-md-12 mb-3">
                  <label>Description</label>
                  <textarea
                    name="description"
                    className="form-control text-dark bg-white"
                    rows="3"
                    value={form.description}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="col-md-6 mb-3">
                  <label>Order</label>
                  <input
                    type="number"
                    name="order"
                    className="form-control text-dark bg-white"
                    value={form.order}
                    onChange={handleChange}
                    min="1"
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="submit" className="btn btn-primary">
                Update
              </button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditModule;
