// src/pages/AddModule.jsx
import { useState } from "react";
import API from "../api";
import "../assets/css/bootstrap.min.css";

const AddModule = ({ onClose, onSuccess, selectedCourse }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    course: selectedCourse ? selectedCourse.id : "",
    order: 1,
    content_type: "video",
    file: null,
    video_url: "",
    text_content: "",
    scorm_package: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("course", form.course);
      data.append("title", form.title);
      data.append("description", form.description);
      data.append("order", form.order);
      data.append("content_type", form.content_type);

      // Upload depending on content type
      if (form.content_type === "video" && form.file)
        data.append("file", form.file);
      if (form.content_type === "pdf" && form.file)
        data.append("file", form.file);
      if (form.content_type === "video" && form.video_url)
        data.append("video_url", form.video_url);
      if (form.content_type === "scorm" && form.scorm_package)
        data.append("scorm_package", form.scorm_package);
      if (form.content_type === "text")
        data.append("text_content", form.text_content);

      await API.post("/api/modules/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Module added successfully!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error adding module");
    } finally {
      setLoading(false);
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
                {/* Title */}
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

                {/* Linked Course */}
                <div className="col-md-6 mb-3">
                  <label>Course</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedCourse ? selectedCourse.title : ""}
                    readOnly
                  />
                </div>

                {/* Description */}
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

                {/* Order */}
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

                {/* Content Type */}
                <div className="col-md-6 mb-3">
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
              </div>

              {/* Conditional Upload Fields */}
              {form.content_type === "video" && (
                <>
                  <div className="mb-3">
                    <label>Upload Video File (optional)</label>
                    <input
                      type="file"
                      name="file"
                      accept="video/*"
                      className="form-control bg-white text-dark"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label>Video URL (optional)</label>
                    <input
                      type="url"
                      name="video_url"
                      className="form-control text-dark bg-white"
                      value={form.video_url}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              {form.content_type === "pdf" && (
                <div className="mb-3">
                  <label>Upload PDF File</label>
                  <input
                    type="file"
                    name="file"
                    accept="application/pdf"
                    className="form-control bg-white text-dark"
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              {form.content_type === "scorm" && (
                <div className="mb-3">
                  <label>Upload SCORM Package (ZIP)</label>
                  <input
                    type="file"
                    name="scorm_package"
                    accept=".zip"
                    className="form-control bg-white text-dark"
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              {form.content_type === "text" && (
                <div className="mb-3">
                  <label>Enter Text or HTML Content</label>
                  <textarea
                    name="text_content"
                    className="form-control text-dark bg-white"
                    rows="6"
                    value={form.text_content}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Saving..." : "Save"}
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
