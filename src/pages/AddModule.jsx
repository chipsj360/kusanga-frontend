// src/pages/AddModule.jsx
import { useState, useEffect } from "react";
import API from "../api";
import "../assets/css/bootstrap.min.css";

const AddModule = ({ onClose, onSuccess, selectedCourse }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    course: selectedCourse ? selectedCourse.id : "",
    order: 1,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/modules/", form);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error adding module");
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Add New Module</h5>
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
                    onChange={handleChange}
                    value={form.title}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Course</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedCourse ? selectedCourse.title : ""}
                    readOnly
                  />
                </div>

                <div className="col-md-12 mb-3">
                  <label>Description</label>
                  <textarea
                    name="description"
                    className="form-control text-dark bg-white"
                    rows="3"
                    onChange={handleChange}
                    value={form.description}
                  ></textarea>
                </div>

                <div className="col-md-6 mb-3">
                  <label>Order</label>
                  <input
                    type="number"
                    name="order"
                    className="form-control text-dark bg-white"
                    onChange={handleChange}
                    value={form.order}
                    min="1"
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="submit" className="btn btn-primary">
                Save
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

export default AddModule;
