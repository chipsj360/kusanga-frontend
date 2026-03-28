// src/pages/ViewModule.jsx
import API from "../api";
import ModuleLauncher from "../components/ModuleLauncher";
import ScormLauncher from "../components/ScormLauncher";
import { useEffect } from "react";

const ViewModule = ({ module, onClose, onDelete, onEdit }) => {

const role = localStorage.getItem("role");
const canTrackProgress = role === "student"; // safest

useEffect(() => {
  if (!module?.id) return;

  const markStarted = async () => {
    try {
      await API.post(`/api/modules/${module.id}/start/`);
    } catch (err) {
      console.error("Failed to mark module started:", err?.response?.data || err);
    }
  };

  markStarted();
}, [module?.id]);


const markCompleted = async () => {
  try {
    await API.post(`/api/modules/${module.id}/complete/`);
    alert("Module marked as completed!");
  } catch (err) {
    console.error("Failed to mark completed:", err?.response?.data || err);
    alert(err?.response?.data?.detail || "Failed to mark completed.");
  }
};


  // Helper to ensure correct absolute URLs
  const getFullUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path; // already absolute URL
    return `${API.defaults.baseURL}${path}`; // prepend API base URL
  };

  // Render module content based on type
  const renderContent = () => {
  let launchUrl = null;

  switch (module.content_type) {
    case "video":
      // External video (YouTube/Vimeo)
      if (module.video_url) {
        launchUrl = module.video_url;
      }
      // Uploaded video
      else if (module.file) {
        launchUrl = getFullUrl(module.file);
      }
      if (launchUrl) {
        return <ModuleLauncher url={launchUrl} onClose={onClose} />;
      }
      break;

    case "pdf":
      launchUrl = getFullUrl(module.file);
      return <ModuleLauncher url={launchUrl} onClose={onClose} />;

    case "text":
      // Open text as a generated blob page
      const textWindow = window.open("", "_blank");
      textWindow.document.write(module.text_content);
      textWindow.document.close();
      onClose();
      return <p className="text-muted">Opening text module...</p>;

    case "scorm":
      return <ScormLauncher moduleId={module.id} onClose={onClose} />;

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
            {canTrackProgress && (
              <button className="btn btn-success" onClick={markCompleted}>
                Mark Completed
              </button>
            )}

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
