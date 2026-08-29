import { useEffect, useRef, useState } from "react";
import API from "../api";

const ScormLauncher = ({ moduleId, onProgressUpdate }) => {
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && isExpanded) setIsExpanded(false);
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isExpanded]);

  const isMaximized = isFullscreen || isExpanded;

  const toggleScormSize = async () => {
    const container = containerRef.current;
    if (!container) return;

    if (document.fullscreenElement === container) {
      await document.exitFullscreen();
      return;
    }

    if (isExpanded) {
      setIsExpanded(false);
      return;
    }

    if (container.requestFullscreen) {
      try {
        await container.requestFullscreen();
        return;
      } catch (error) {
        console.warn("Fullscreen unavailable; using expanded view.", error);
      }
    }

    setIsExpanded(true);
  };

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
        ...(isExpanded
          ? {
              position: "fixed",
              inset: 0,
              zIndex: 2000,
              padding: "0.75rem",
            }
          : {}),
      }}
    >
      <div className="d-flex justify-content-end mb-2">
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={toggleScormSize}
          title={isMaximized ? "Restore SCORM player" : "Maximize SCORM player"}
          aria-label={isMaximized ? "Restore SCORM player" : "Maximize SCORM player"}
        >
          {isMaximized ? "Minimize" : "Maximize"}
        </button>
      </div>
      <iframe
        src={`${API.defaults.baseURL}/api/scorm/launch/${moduleId}/`}
        title="SCORM Player"
        style={{
          width: "100%",
          height: isMaximized ? "100%" : "75vh",
          flex: isMaximized ? "1 1 auto" : undefined,
          minHeight: 0,
          border: "none",
        }}
        allow="fullscreen"
      />
    </div>
  );
};

export default ScormLauncher;