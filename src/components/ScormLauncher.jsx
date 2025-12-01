import { useEffect } from "react";
import API from "../api";

const ScormLauncher = ({ moduleId, onClose }) => {
  useEffect(() => {
    const launchUrl = `${API.defaults.baseURL}/api/scorm/launch/${moduleId}/`;
    window.open(
      launchUrl,
      "_blank",
      "noopener,noreferrer,width=1200,height=800"
    );

    // Close modal after opening (optional)
    onClose();
  }, []);

  return <p className="text-muted">Launching SCORM...</p>;
};

export default ScormLauncher;
