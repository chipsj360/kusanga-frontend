// src/pages/ViewModule.jsx
import API from "../api";

const ViewModule = ({ module, onClose, onDelete, onEdit }) => {
  // Helper to ensure correct absolute URLs
  const getFullUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path; // already absolute URL
    return `${API.defaults.baseURL}${path}`; // prepend API base URL
  };

  // Render module content based on type
  const renderContent = () => {
    switch (module.content_type) {
      case "video":
        if (module.video_url) {
          // External video (e.g. YouTube/Vimeo)
          return (
            <div className="ratio ratio-16x9 mb-3">
              <iframe
                src={module.video_url}
                title={module.title}
                allowFullScreen
              />
            </div>
          );
        } else if (module.file) {
          // Uploaded video file
          return (
            <video controls className="w-100 mb-3 rounded border">
              <source src={getFullUrl(module.file)} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          );
        }
        break;

      case "pdf":
        // Display PDF files inside iframe
        return (
          <iframe
            src={getFullUrl(module.file)}
            className="w-100 mb-3 border rounded"
            style={{ height: "600px" }}
            title={module.title}
          />
        );

      case "scorm":
        // Display SCORM package (unzipped directory containing index.html)
        return (
          <iframe
            src={getFullUrl(module.scorm_package)}
            className="w-100 mb-3 border rounded"
            style={{ height: "600px" }}
            title={module.title}
          />
        );

      case "text":
        // Render HTML/text-based content
        return (
          <div
            className="mb-3 border rounded p-3 bg-light text-dark"
            dangerouslySetInnerHTML={{ __html: module.text_content }}
          />
        );

      default:
        return <p className="mb-3 text-muted">No content available</p>;
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content rounded-3 shadow">
          {/* --- Modal Header --- */}
          <div className="modal-header bg-light">
            <h5 className="modal-title fw-bold text-dark">
              Module Details
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          {/* --- Modal Body --- */}
          <div className="modal-body text-dark">
            <div className="mb-2">
              <strong>Title:</strong> {module.title}
            </div>
            <div className="mb-2">
              <strong>Description:</strong> {module.description}
            </div>
            <div className="mb-2">
              <strong>Order:</strong> {module.order}
            </div>
            <div className="mb-2">
              <strong>Course:</strong> {module.course_title || module.course}
            </div>

            <hr />
            <div className="mb-3">
              <strong>Content:</strong>
            </div>
            {renderContent()}
          </div>

          {/* --- Modal Footer --- */}
          <div className="modal-footer d-flex justify-content-between">
            <div>
              <button className="btn btn-warning me-2" onClick={onEdit}>
                Edit
              </button>
              <button
                className="btn btn-danger"
                onClick={() => onDelete(module.id)}
              >
                Delete
              </button>
            </div>
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewModule;
