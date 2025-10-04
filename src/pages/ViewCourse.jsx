const ViewCourse = ({ course, onClose, onDelete, onEdit }) => {
  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content rounded-3 shadow">
          <div className="modal-header bg-light">
            <h5 className="modal-title fw-bold text-dark">Course Details</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body text-dark">
            <div className="mb-2"><strong>Title:</strong> {course.title}</div>
            <div className="mb-2"><strong>Description:</strong> {course.description}</div>
            <div className="mb-2"><strong>Course Type:</strong> {course.course_type}</div>
            <div className="mb-2"><strong>Duration:</strong> {course.duration || "-"}</div>
            <div className="mb-2"><strong>Created At:</strong> {course.created_at || "-"}</div>
            <div className="mb-2"><strong>Created By:</strong> {course.created_by || "-"}</div>
          </div>

          <div className="modal-footer d-flex justify-content-between">
            <div>
              <button
                className="btn btn-warning me-2"
                onClick={onEdit}
              >
                Edit
              </button>
              <button
                className="btn btn-danger"
                onClick={() => onDelete(course.id)}
              >
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

export default ViewCourse;
