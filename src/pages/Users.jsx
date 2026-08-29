import { useEffect, useState } from "react";
import PageTitle from "../components/PageTitle";
import API from "../api";
import AddUser from "./AddUser";
import ViewUser from "./ViewUser";
import EditUser from "./EditUser";
import "../assets/css/bootstrap.min.css";
import "../assets/css/user.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch users from backend
  useEffect(() => {
    fetchUsers();
    fetchDepartments();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("api/users/");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await API.get("/api/auth/departments/");
      setDepartments(res.data);
    } catch (err) {
      console.error("Error fetching departments:", err.response?.data || err);
    }
  };

  const departmentNameById = new Map(
    departments.map((department) => [String(department.id), department.name]),
  );

  const getDepartmentName = (user) => {
    if (user.department && typeof user.department === "object") {
      return user.department.name || "-";
    }

    return departmentNameById.get(String(user.department)) || "-";
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await API.delete(`/api/users/${id}/`);
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const query = searchTerm.trim().toLowerCase();
  const filteredUsers = users.filter((user) => {
    const values = [
      user.full_name,
      user.email,
      user.role,
      user.job_title,
      getDepartmentName(user),
      user.employee_id,
    ];

    return !query || values.some((value) =>
      String(value ?? "").toLowerCase().includes(query)
    );
  });

  return (
     <>
     <PageTitle title="Users" />
      <style>{`
        .management-icon-button {
          display: inline-flex;
          width: 40px;
          height: 40px;
          min-width: 40px;
          align-items: center;
          justify-content: center;
          padding: 0;
        }

        .management-icon-button i {
          font-size: 18px;
        }
      `}</style>
      <div className="container-fluid px-3">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
          <h3 className="mb-2">User Management</h3>
          <button
            type="button"
            className="management-icon-button btn btn-danger mb-2"
            onClick={() => setShowAdd(true)}
            title="Add new user"
            aria-label="Add new user"
          >
            <i className="ph ph-user-plus" aria-hidden="true"></i>
          </button>
        </div>

        <div className="mb-3" style={{ width: "100%", maxWidth: "420px" }}>
          <input
            type="search"
            placeholder="Search users"
            className="form-control text-dark border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle users-table">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Job Title</th>
                <th>Department</th>
                <th>Employee ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td data-label="ID">{u.id}</td>
                  <td data-label="Name">{u.full_name}</td>
                  <td data-label="Email">{u.email}</td>
                  <td data-label="Role">{u.role}</td>
                  <td data-label="Job Title">{u.job_title || "-"}</td>
                  <td data-label="Department">{getDepartmentName(u)}</td>
                  <td data-label="Employee Id">{u.employee_id || "-"}</td>
                  <td data-label="Actions">
                    <div className="d-flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="management-icon-button btn btn-sm btn-info"
                        onClick={() => {
                          setSelectedUser(u);
                          setShowView(true);
                        }}
                        title={`View ${u.full_name || u.email}`}
                        aria-label={`View ${u.full_name || u.email}`}
                      >
                        <i className="ph ph-eye" aria-hidden="true"></i>
                      </button>
                      <button
                        type="button"
                        className="management-icon-button btn btn-sm btn-warning"
                        onClick={() => {
                          setSelectedUser(u);
                          setShowEdit(true);
                        }}
                        title={`Edit ${u.full_name || u.email}`}
                        aria-label={`Edit ${u.full_name || u.email}`}
                      >
                        <i className="ph ph-pencil-simple" aria-hidden="true"></i>
                      </button>
                      <button
                        type="button"
                        className="management-icon-button btn btn-sm btn-danger"
                        onClick={() => handleDelete(u.id)}
                        title={`Delete ${u.full_name || u.email}`}
                        aria-label={`Delete ${u.full_name || u.email}`}
                      >
                        <i className="ph ph-trash" aria-hidden="true"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!filteredUsers.length && (
                <tr>
                  <td colSpan="8" className="text-center text-muted py-3">
                    {users.length ? "No users match your search." : "No users found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
    {/* Modals */}
        {showAdd && (
          <AddUser
            onClose={() => setShowAdd(false)}
            onSuccess={fetchUsers}
          />
        )}
        {showView && selectedUser && (
          <ViewUser user={selectedUser} onClose={() => setShowView(false)} />
        )}
        {showEdit && selectedUser && (
          <EditUser
            user={selectedUser}
            onClose={() => setShowEdit(false)}
            onSuccess={fetchUsers}
          />
        )}
      </div>
     </>
  );
};

export default Users;