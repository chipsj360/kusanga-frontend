import { useEffect, useRef } from "react";
import API from "../api";

const ScormLauncher = ({ moduleId, onClose, onProgressUpdate }) => {
  const popupRef = useRef(null);
  const openedRef = useRef(false);
  const onCloseRef = useRef(onClose);
  const onProgressUpdateRef = useRef(onProgressUpdate);

  useEffect(() => {
    onCloseRef.current = onClose;
    onProgressUpdateRef.current = onProgressUpdate;
  }, [onClose, onProgressUpdate]);

  useEffect(() => {
    if (!moduleId || openedRef.current) return;

    openedRef.current = true;

    const scormUrl = `${API.defaults.baseURL}/api/scorm/launch/${moduleId}/`;
    popupRef.current = window.open(scormUrl, "_blank", "width=1200,height=800");

    const handleMessage = async (event) => {
      if (!event?.data) return;

      const allowedOrigin = new URL(API.defaults.baseURL).origin;
      if (event.origin !== allowedOrigin) return;

      if (
        event.data.type === "SCORM_PROGRESS" &&
        Number(event.data.moduleId) === Number(moduleId)
      ) {
        try {
          await API.post(`/api/modules/${moduleId}/scorm_progress/`, {
            lesson_status: event.data.lesson_status,
            lesson_location: event.data.lesson_location,
            score_raw: event.data.score_raw,
            total_time: event.data.total_time,
            suspend_data: event.data.suspend_data,
          });

          if (onProgressUpdateRef.current) {
            onProgressUpdateRef.current();
          }
        } catch (err) {
          console.error("Failed to save SCORM progress:", err?.response?.data || err);
        }
      }
    };

    window.addEventListener("message", handleMessage);

    const timer = setInterval(() => {
      if (popupRef.current && popupRef.current.closed) {
        clearInterval(timer);
        window.removeEventListener("message", handleMessage);
        openedRef.current = false;
        if (onCloseRef.current) {
          onCloseRef.current();
        }
      }
    }, 1000);

    return () => {
      clearInterval(timer);
      window.removeEventListener("message", handleMessage);
    };
  }, [moduleId]);

  return <p className="text-muted">Opening SCORM module...</p>;
};

export default ScormLauncher;