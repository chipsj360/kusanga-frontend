import { useCallback, useEffect, useMemo, useState } from "react";
import PageTitle from "../components/PageTitle";
import API from "../api";
import AddDepartment from "./AddDepartment";
import EditDepartment from "./EditDepartment";
import "../assets/css/bootstrap.min.css";
import "../assets/css/user.css";


const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchDepartments = useCallback(async () => {
    setError("");
    try {
      const response = await API.get("/api/departments/");
      setDepartments(Array.isArray(response.data) ? response.data : response.data.results || []);
    } catch (err) {
      setError("Unable to load departments. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleDelete = async (department) => {
    if (!window.confirm(`Are you sure you want to delete ${department.name}?`)) return;
    setError("");
    try {
      await API.delete(`/api/departments/${department.id}/`);
      setDepartments((current) => current.filter((item) => item.id !== department.id));
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to delete the department. Please try again.");
    }
  };

  const filteredDepartments = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return departments.filter((department) =>
      !query || department.name.toLowerCase().includes(query)
    );
  }, [departments, searchTerm]);

  return (
     <>
     <PageTitle title="Departments" />
      <div className="container-fluid px-3">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
          <h3 className="mb-2">Department Management</h3>
          <button className="btn btn-danger mb-2" onClick={() => setShowAdd(true)}>Add New Department</button>
        </div>

        {error && <div className="alert alert-danger" role="alert">{error}</div>}

        <div className="mb-3" style={{ width: "100%", maxWidth: "420px" }}>
          <input
            type="search"
            placeholder="Search departments"
            aria-label="Search departments"
            className="form-control text-dark border rounded"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle users-table">
            <thead className="table-light">
              <tr><th>ID</th><th>Name</th><th>Assigned Users</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filteredDepartments.map((department) => (
                <tr key={department.id}>
                  <td data-label="ID">{department.id}</td>
                  <td data-label="Name">{department.name}</td>
                  <td data-label="Assigned Users">{department.user_count ?? 0}</td>
                  <td data-label="Actions">
                    <div className="btn-group flex-wrap">
                      <button className="btn btn-sm btn-warning" onClick={() => setSelectedDepartment(department)}>Edit</button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(department)}
                        disabled={department.user_count > 0}
                        title={department.user_count > 0 ? "Reassign users before deleting this department" : "Delete department"}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && !filteredDepartments.length && (
                <tr><td colSpan="4" className="text-center text-muted py-3">
                  {departments.length ? "No departments match your search." : "No departments found."}
                </td></tr>
              )}
              {isLoading && (
                <tr><td colSpan="4" className="text-center text-muted py-3">Loading departments...</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {showAdd && <AddDepartment onClose={() => setShowAdd(false)} onSuccess={fetchDepartments} />}
        {selectedDepartment && (
          <EditDepartment
            department={selectedDepartment}
            onClose={() => setSelectedDepartment(null)}
            onSuccess={fetchDepartments}
          />
        )}
      </div>
     </>
  );
};

export default Departments;
