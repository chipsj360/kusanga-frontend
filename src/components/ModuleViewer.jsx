// src/components/ModuleViewer.jsx
import React from "react";

const ModuleViewer = ({ module }) => {
  if (!module) return <p>No module selected.</p>;

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

      case "text":
        return (
          <div
            className="bg-light p-3 rounded border text-dark"
            dangerouslySetInnerHTML={{ __html: module.text_content }}
          ></div>
        );

      case "scorm":
        return (
          <iframe
            src={`/scorm/player/?module_id=${module.id}`}
            width="100%"
            height="600px"
            title="SCORM Player"
            style={{ border: "none" }}
          />
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
