// src/pages/EditModule.jsx
import { useState } from "react";
import API from "../api";
import "../assets/css/bootstrap.min.css";

const EditModule = ({ module, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: module.title,
    description: module.description,
    course: module.course, // keep course ID
    order: module.order,
    content_type: module.content_type || "video",
    file: null,
    scorm_package: null,
    video_url: module.video_url || "",
    text_content: module.text_content || "",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, fieldName) => {
    setForm({ ...form, [fieldName]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("description", form.description || "");
      data.append("order", form.order || 1);
      data.append("content_type", form.content_type);

      if (form.content_type === "video") {
        if (form.file instanceof File) data.append("file", form.file);
        if (form.video_url) data.append("video_url", form.video_url);
      }

      if (form.content_type === "pdf" && form.file instanceof File) {
        data.append("file", form.file);
      }

      if (form.content_type === "scorm" && form.scorm_package instanceof File) {
        data.append("scorm_package", form.scorm_package);
      }

      if (form.content_type === "text") {
        data.append("text_content", form.text_content || "");
      }

      await API.put(`/api/modules/${module.id}/`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Module updated successfully!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error updating module");
    } finally {
      setSaving(false);
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
              {/* Title */}
              <div className="mb-3">
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

              {/* Course */}
              <div className="mb-3">
                <label>Course</label>
                <input
                  type="text"
                  className="form-control"
                  value={module.course_title || module.course}
                  readOnly
                />
              </div>

              {/* Description */}
              <div className="mb-3">
                <label>Description</label>
                <textarea
                  name="description"
                  className="form-control text-dark bg-white"
                  rows="3"
                  value={form.description}
                  onChange={handleChange}
                ></textarea>
              </div>

              {/* Order */}
              <div className="mb-3">
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

              {/* Content Type */}
              <div className="mb-3">
                <label>Content Type</label>
                <select
                  name="content_type"
                  className="form-select text-dark bg-white"
                  value={form.content_type}
                  onChange={handleChange}
                >
                  <option value="video">Video</option>
                  <option value="pdf">PDF</option>
                  <option value="scorm">SCORM</option>
                  <option value="text">Text</option>
                </select>
              </div>

              {/* Conditional Inputs */}
              {form.content_type === "video" && (
                <>
                  <div className="mb-3">
                    <label>Upload New Video (optional)</label>
                    <input
                      type="file"
                      accept="video/*"
                      className="form-control bg-white text-dark"
                      onChange={(e) => handleFileChange(e, "file")}
                    />
                  </div>
                  <div className="mb-3">
                    <label>Video URL (optional)</label>
                    <input
                      type="url"
                      className="form-control text-dark bg-white"
                      name="video_url"
                      value={form.video_url}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              {form.content_type === "pdf" && (
                <div className="mb-3">
                  <label>Upload New PDF</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="form-control bg-white text-dark"
                    onChange={(e) => handleFileChange(e, "file")}
                  />
                </div>
              )}

              {form.content_type === "scorm" && (
                <div className="mb-3">
                  <label>Upload New SCORM Package (ZIP)</label>
                  <input
                    type="file"
                    accept=".zip"
                    className="form-control bg-white text-dark"
                    onChange={(e) => handleFileChange(e, "scorm_package")}
                  />
                </div>
              )}

              {form.content_type === "text" && (
                <div className="mb-3">
                  <label>Text / HTML Content</label>
                  <textarea
                    className="form-control text-dark bg-white"
                    rows="6"
                    name="text_content"
                    value={form.text_content}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Saving..." : "Update Module"}
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
