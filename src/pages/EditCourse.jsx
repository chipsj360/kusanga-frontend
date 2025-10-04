import { useState } from "react";
import API from "../api";
import "../assets/css/bootstrap.min.css";

const EditCourse = ({ course, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: course.title,
    description: course.description,
    course_type: course.course_type,
    duration: course.duration || "",
    created_by: course.created_by || "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/api/Courses/${course.id}/`, formData);
      onSuccess();
      alert("Course updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error updating course!");
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content rounded-3 shadow">
          <div className="modal-header bg-light">
            <h5 className="modal-title fw-bold text-dark">Edit Course</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label text-dark">Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-control border-dark rounded"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-dark">Description</label>
                <textarea
                  name="description"
                  className="form-control border-dark rounded"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label text-dark">Course Type</label>
                <input
                  type="text"
                  name="course_type"
                  className="form-control border-dark rounded"
                  value={formData.course_type}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-dark">Duration</label>
                <input
                  type="text"
                  name="duration"
                  className="form-control border-dark rounded"
                  value={formData.duration}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-dark">Created By</label>
                <input
                  type="text"
                  name="created_by"
                  className="form-control border-dark rounded"
                  value={formData.created_by}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="submit" className="btn btn-success">
                Save Changes
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCourse;
