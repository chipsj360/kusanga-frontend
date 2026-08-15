/ src/components/ModuleViewer.jsx
import React, { useEffect, useRef, useState } from "react";

const ModuleViewer = ({ module }) => {
  const scormContainerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === scormContainerRef.current);
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

  if (!module) return <p>No module selected.</p>;

  const isMaximized = isFullscreen || isExpanded;

  const toggleScormSize = async () => {
    const container = scormContainerRef.current;
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

  const renderContent = () => {
    switch (module.content_type) {
      case "video":
        return (
          <video
            controls
            src={module.file || module.video_url}
            className="w-100 rounded shadow"
            style={{ maxHeight: "500px" }}
          />
        );

      case "pdf":
        return (
          <iframe
            src={module.file}
            width="100%"
            height="600px"
            title="PDF Viewer"
            style={{ border: "none" }}
          />
        );

      case "scorm":
        return (
          <div
            ref={scormContainerRef}
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
                className="btn btn-outline-secondary btn-sm"
                onClick={toggleScormSize}
                title={isMaximized ? "Restore SCORM player" : "Maximize SCORM player"}
                aria-label={isMaximized ? "Restore SCORM player" : "Maximize SCORM player"}
              >
                {isMaximized ? "Minimize" : "Maximize"}
              </button>
            </div>
            <iframe
              src={`/scorm/player/?module_id=${module.id}`}
              width="100%"
              title="SCORM Player"
              style={{
                border: "none",
                height: isMaximized ? "100%" : "600px",
                flex: isMaximized ? "1 1 auto" : undefined,
                minHeight: 0,
              }}
              allow="fullscreen"
            />
          </div>
        );

      default:
        return <p>Unsupported module type.</p>;
    }
  };

  return (
    <div>
      <h5 className="fw-bold mb-3">{module.title}</h5>
      <p className="text-muted">{module.description}</p>
      {renderContent()}
    </div>
  );
};

export default ModuleViewer;