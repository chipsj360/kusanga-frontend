// src/pages/ViewModule.jsx
const ViewModule = ({ module, onClose, onDelete, onEdit }) => {
  // Render module content based on type
  const renderContent = () => {
    switch (module.content_type) {
      case "video":
        if (module.video_url) {
          return (
            <div className="ratio ratio-16x9 mb-3">
              <iframe
                src={module.video_url}
                title={module.title}
                allowFullScreen
              ></iframe>
            </div>
          );
        } else if (module.file) {
          return (
            <video controls className="w-100 mb-3">
              <source src={module.file} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          );
        }
        break;

      case "pdf":
        return (
          <iframe
            src={module.file}
            type="application/pdf"
            className="w-100 mb-3"
            style={{ height: "600px" }}
          ></iframe>
        );

      case "scorm":
        return (
          <iframe
            src={module.scorm_package} // SCORM package URL
            className="w-100 mb-3"
            style={{ height: "600px" }}
            title={module.title}
          ></iframe>
        );

      case "text":
        return (
          <div
            className="mb-3"
            dangerouslySetInnerHTML={{ __html: module.text_content }}
          />
        );

      default:
        return <p className="mb-3">No content available</p>;
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content rounded-3 shadow">
          <div className="modal-header bg-light">
            <h5 className="modal-title fw-bold text-dark">Module Details</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body text-dark">
            <div className="mb-2"><strong>Title:</strong> {module.title}</div>
            <div className="mb-2"><strong>Description:</strong> {module.description}</div>
            <div className="mb-2"><strong>Order:</strong> {module.order}</div>
            <div className="mb-2"><strong>Course:</strong> {module.course_title || module.course}</div>
            
            <hr />
            <div className="mb-3"><strong>Content:</strong></div>
            {renderContent()}
          </div>

          <div className="modal-footer d-flex justify-content-between">
            <div>
              <button className="btn btn-warning me-2" onClick={onEdit}>
                Edit
              </button>
              <button className="btn btn-danger" onClick={() => onDelete(module.id)}>
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
