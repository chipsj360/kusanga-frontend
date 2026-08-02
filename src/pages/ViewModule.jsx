import API from "../api";
import ModuleLauncher from "../components/ModuleLauncher";
import ScormLauncher from "../components/ScormLauncher";
import { useEffect, useRef, useCallback } from "react";

const ViewModule = ({ module, onClose, onDelete, onEdit, onProgressUpdate }) => {
  const role = localStorage.getItem("role");
  const canManage = role === "trainer" || role === "admin";

  const hasStartedRef = useRef(false);
  const hasCompletedRef = useRef(false);

  const markStarted = useCallback(async () => {
    if (!module?.id || hasStartedRef.current) return;

    try {
      await API.post(`/api/modules/${module.id}/start/`);
      hasStartedRef.current = true;
      if (onProgressUpdate) onProgressUpdate();
    } catch (err) {
      console.error("Failed to mark module started:", err?.response?.data || err);
    }
  }, [module?.id, onProgressUpdate]);



  const markCompleted = useCallback(async () => {
    if (!module?.id || hasCompletedRef.current === true) return;

    try {
      await API.post(`/api/modules/${module.id}/complete/`);
      hasCompletedRef.current = true;
      if (onProgressUpdate) onProgressUpdate();
    } catch (err) {
      console.error("Failed to mark completed:", err?.response?.data || err);
    }
  }, [module?.id, onProgressUpdate]);



  useEffect(() => {
    if (!module?.id) return;
    markStarted();
  }, [module?.id, markStarted]);



const handleClose = async () => {
  // Do not auto-complete video or scorm on close
  if (module?.content_type === "pdf" || module?.content_type === "text") {
    await markCompleted();
  }
  onClose();
};

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!module?.id || hasCompletedRef.current) return;

      const url = `${API.defaults.baseURL}/api/modules/${module.id}/complete/`;
      const token = localStorage.getItem("access");

      const blob = new Blob([], { type: "application/json" });
      navigator.sendBeacon?.(url, blob);

      // Fallback note:
      // sendBeacon usually cannot attach Authorization headers,
      // so controlled close via handleClose is still the main reliable path.
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [module?.id]);

  const getFullUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${API.defaults.baseURL}${path}`;
  };

  const renderContent = () => {
    let launchUrl = null;

    switch (module.content_type) {
      case "video":
        return (
          <ModuleLauncher
            url={`${window.location.origin}/module-launcher/${module.id}`}
            onClose={onClose}
          />
        );
        break;

      case "pdf":
        launchUrl = getFullUrl(module.file);
        return <ModuleLauncher url={launchUrl} onClose={handleClose} />;

      case "text": {
        const textWindow = window.open("", "_blank");
        if (textWindow) {
          textWindow.document.write(module.text_content || "");
          textWindow.document.close();

          const timer = setInterval(() => {
            if (textWindow.closed) {
              clearInterval(timer);
              handleClose();
            }
          }, 1000);
        }
        return <p className="text-muted">Opening text module...</p>;
      }

      case "scorm":
        return (
          <ScormLauncher
            moduleId={module.id}
            onClose={onClose}
            onProgressUpdate={onProgressUpdate}
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
          <div className="modal-header bg-light">
            <h5 className="modal-title fw-bold text-dark">Module Details</h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>

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

          <div className="modal-footer d-flex justify-content-between">
            {canManage && (
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
            )}

            <button className="btn btn-secondary" onClick={handleClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewModule;