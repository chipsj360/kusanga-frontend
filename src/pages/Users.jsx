// src/pages/Users.jsx
import { useState } from "react";
import '../assets/css/bootstrap.min.css'
import '../assets/css/user.css'
const Users = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Elizabeth Mulenga",
      email: "elizabeth@atzambia.com",
      role: "CLIENT",
      staff: false,
      active: true,
      dateJoined: "2025-06-02",
    },
    {
      id: 2,
      name: "anita one",
      email: "anita@gmail.com",
      role: "AGENT",
      staff: false,
      active: true,
      dateJoined: "2025-06-18",
    },
  ]);

  // CRUD actions
  const handleDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const handleToggleActive = (id) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, active: !user.active } : user
      )
    );
  };

  return (
    <div className="container ">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>User Management</h3>
        <button className="btn btn-danger">Add New User</button>
      </div>

      <input
        type="text"
        placeholder="Search by email or name"
        className="form-control mb-3"
      />

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Staff</th>
              <th>Active</th>
              <th>Date Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <span
                    className={`badge bg-${u.staff ? "success" : "secondary"}`}
                  >
                    {u.staff ? "Yes" : "No"}
                  </span>
                </td>
                <td>
                  <button
                    className={`btn btn-sm btn-${
                      u.active ? "success" : "secondary"
                    }`}
                    onClick={() => handleToggleActive(u.id)}
                  >
                    {u.active ? "Yes" : "No"}
                  </button>
                </td>
                <td>{u.dateJoined}</td>
                <td>
                  <button className="btn btn-sm btn-info me-1">View</button>
                  <button className="btn btn-sm btn-warning me-1">Edit</button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(u.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Placeholder */}
      <div className="d-flex justify-content-center mt-3">
        <button className="btn btn-sm btn-light me-2">Prev</button>
        <button className="btn btn-sm btn-primary">1</button>
        <button className="btn btn-sm btn-light ms-2">Next</button>
      </div>
    </div>
  );
};

export default Users;
