import { useEffect, useState } from "react";
import API from "../api";
import "../assets/css/bootstrap.min.css";

const COURSE_TYPES = ["scorm", "xapi", "video", "pdf"];

const getUserDisplayName = (user) =>
  user?.full_name?.trim() || user?.username || "Unknown user";

const EditCourse = ({ course, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: course.title || "",
    description: course.description || "",
    course_type: COURSE_TYPES.includes(course.course_type)
      ? course.course_type
      : "",
    record_type: course.record_type || "compliance",
    duration: course.duration || "",
    expiry_months: course.expiry_months || "",
  });
  const [creatorName, setCreatorName] = useState(
    course.created_by_name || course.created_by_username || "Loading...",
  );

  useEffect(() => {
    let active = true;

    const fetchCreator = async () => {
      if (course.created_by_name || course.created_by_username) return;

      try {
        const endpoint = course.created_by
          ? `/api/users/${course.created_by}/`
          : "/api/auth/user/";
        const response = await API.get(endpoint);
        if (active) setCreatorName(getUserDisplayName(response.data));
      } catch (error) {
        console.error("Error fetching course creator:", error);

        try {
          const response = await API.get("/api/auth/user/");
          if (active && (!course.created_by || response.data.id === course.created_by)) {
            setCreatorName(getUserDisplayName(response.data));
          } else if (active) {
            setCreatorName("Unknown user");
          }
        } catch (currentUserError) {
          console.error("Error fetching current user:", currentUserError);
          if (active) setCreatorName("Unknown user");
        }
      }
    };

    fetchCreator();
    return () => {
      active = false;
    };
  }, [course.created_by, course.created_by_name, course.created_by_username]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/api/courses/${course.id}/`, formData);
      onSuccess();
      onClose();
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
                <select
                  name="course_type"
                  className="form-select border-dark rounded"
                  value={formData.course_type}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select a course type</option>
                  <option value="scorm">SCORM</option>
                  <option value="xapi">xAPI</option>
                  <option value="video">Video</option>
                  <option value="pdf">PDF</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Record Type</label>
                <select
                  name="record_type"
                  className="form-select"
                  value={formData.record_type}
                  onChange={handleChange}
                  required
                >
                  <option value="compliance">Compliance</option>
                  <option value="competence">Competence</option>
                </select>
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
                <label className="form-label text-dark">
                  Expiry Time Frame (Months)
                </label>
                <input
                  type="number"
                  name="expiry_months"
                  className="form-control border-dark rounded"
                  value={formData.expiry_months}
                  onChange={handleChange}
                  min="1"
                  step="1"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-dark">Created By</label>
                <input
                  type="text"
                  className="form-control border-dark rounded bg-light"
                  value={creatorName}
                  readOnly
                  aria-readonly="true"
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