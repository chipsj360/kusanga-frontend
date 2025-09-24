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
      name: "Anita One",
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
    <div className="container-fluid px-3">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <h3 className="mb-2">User Management</h3>
        <button className="btn btn-danger mb-2">Add New User</button>
      </div>

      <input
        type="text"
        placeholder="Search by email or name"
        className="form-control mb-3"
      />

      {/* Responsive Table / Card view */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle users-table">
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
                <td data-label="ID">{u.id}</td>
                <td data-label="Name">{u.name}</td>
                <td data-label="Email" className="text-truncate">{u.email}</td>
                <td data-label="Role">{u.role}</td>
                <td data-label="Staff">
                  <span className={`badge bg-${u.staff ? "success" : "secondary"}`}>
                    {u.staff ? "Yes" : "No"}
                  </span>
                </td>
                <td data-label="Active">
                  <button
                    className={`btn btn-sm btn-${u.active ? "success" : "secondary"}`}
                    onClick={() => handleToggleActive(u.id)}
                  >
                    {u.active ? "Yes" : "No"}
                  </button>
                </td>
                <td data-label="Date Joined">{u.dateJoined}</td>
                <td data-label="Actions">
                  <div className="btn-group flex-wrap">
                    <button className="btn btn-sm btn-info">View</button>
                    <button className="btn btn-sm btn-warning">Edit</button>
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

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-3 flex-wrap">
        <button className="btn btn-sm btn-light me-2 mb-2">Prev</button>
        <button className="btn btn-sm btn-primary mb-2">1</button>
        <button className="btn btn-sm btn-light ms-2 mb-2">Next</button>
      </div>
    </div>
  );
};

export default Users;
