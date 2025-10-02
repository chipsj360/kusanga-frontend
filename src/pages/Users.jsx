import { useEffect, useState } from "react";
import API from "../api";
import "../assets/css/bootstrap.min.css";
import "../assets/css/user.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  // Fetch users from backend
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("api/users/");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await API.delete(`/users/${id}/`);
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container-fluid px-3">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <h3 className="mb-2">User Management</h3>
        <button className="btn btn-danger mb-2" onClick={() => setShowAdd(true)}>
          Add New User
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by email or name"
        className="form-control mb-3"
      />

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
            {users.map((u) => (
              <tr key={u.id}>
                <td data-label="ID">{u.id}</td>
                <td data-label="Name">{u.full_name}</td>
                <td data-label="Email">{u.email}</td>
                <td data-label="Role">{u.role}</td>
                <td data-label="Job Title">{u.job_title || "-"}</td>
                <td data-label="Department">{u.department || "-"}</td>
                <td data-label="Employee Id">{u.employee_id || "-"}</td>
                <td data-label="Actions">
                  <div className="btn-group flex-wrap">
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => {
                        setSelectedUser(u);
                        setShowView(true);
                      }}
                    >
                      View
                    </button>
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => {
                        setSelectedUser(u);
                        setShowEdit(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(u.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

   
    </div>
  );
};

export default Users;
