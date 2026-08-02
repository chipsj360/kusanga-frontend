import { useEffect } from "react";
import API from "../api";

const ScormLauncher = ({ moduleId, onProgressUpdate }) => {
  useEffect(() => {
    const handleMessage = async (event) => {
      if (!event?.data) return;

      console.log("Received SCORM message:", event.origin, event.data);

      if (
        event.data.type === "SCORM_PROGRESS" &&
        Number(event.data.moduleId) === Number(moduleId)
      ) {
        try {
          console.log("Posting SCORM progress to Django:", event.data);

          await API.post(`/api/modules/${moduleId}/scorm_progress/`, {
            lesson_status: event.data.lesson_status,
            lesson_location: event.data.lesson_location,
            score_raw: event.data.score_raw,
            total_time: event.data.total_time,
            suspend_data: event.data.suspend_data,
          });

          if (onProgressUpdate) onProgressUpdate();
        } catch (err) {
          console.error("Failed to save SCORM progress:", err?.response?.data || err);
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [moduleId, onProgressUpdate]);

  return (
    <iframe
      src={`${API.defaults.baseURL}/api/scorm/launch/${moduleId}/`}
      title="SCORM Player"
      style={{
        width: "100%",
        height: "75vh",
        border: "none",
      }}
      allow="fullscreen"
    />
  );
};

export default ScormLauncher;