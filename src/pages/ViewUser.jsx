import { useEffect, useState } from "react";
import API from "../api";

const ViewUser = ({ user, onClose }) => {
  const [departmentName, setDepartmentName] = useState(
    user.department && typeof user.department === "object"
      ? user.department.name || "-"
      : user.department
        ? "Loading..."
        : "-",
  );

  useEffect(() => {
    let active = true;

    const fetchDepartmentName = async () => {
      if (user.department && typeof user.department === "object") {
        setDepartmentName(user.department.name || "-");
        return;
      }

      if (!user.department) {
        setDepartmentName("-");
        return;
      }

      try {
        const response = await API.get("/api/auth/departments/");
        const department = response.data.find(
          (item) => String(item.id) === String(user.department),
        );
        if (active) setDepartmentName(department?.name || "-");
      } catch (err) {
        console.error("Error fetching department:", err.response?.data || err);
        if (active) setDepartmentName("-");
      }
    };

    fetchDepartmentName();
    return () => {
      active = false;
    };
  }, [user.department]);

  return (
    <div className="modal show d-block">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">User Details</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p><strong>Name:</strong> {user.full_name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Department:</strong> {departmentName}</p>
            <p><strong>Job Title:</strong> {user.job_title || "-"}</p>
            <p><strong>Employee ID:</strong> {user.employee_id || "-"}</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUser;