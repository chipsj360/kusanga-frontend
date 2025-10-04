// src/pages/ViewModule.jsx
const ViewModule = ({ module, onClose, onDelete, onEdit }) => {
  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-lg">
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
