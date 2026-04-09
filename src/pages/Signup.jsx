import "../assets/css/Signup.css";
import "../assets/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    role: "",
    department: "",
    job_title: "",
    employee_id: "",
  });

  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/auth/register/", formData);
      alert("Account created! Please login.");
      navigate("/login");
    } catch (error) {
      console.error(error.response?.data);
      alert("Signup failed");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolesRes = await API.get("/api/auth/roles/");
        setRoles(rolesRes.data);

        const deptRes = await API.get("api/auth/departments/");
        setDepartments(deptRes.data);
      } catch (err) {
        console.error("Error loading roles/departments", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="scholar-signup-page">
      <div className="container-fluid p-0">
        <div className="row g-0 min-vh-100">
          
          {/* LEFT PANEL */}
          <div className="col-lg-5 scholar-signup-left d-flex flex-column position-relative">

            {/* Overlay */}
            <div className="scholar-overlay"></div>

            {/* Brand */}
            <div className="scholar-brand position-relative">
              <span className="brand-icon">📖</span>
              <span className="brand-name">The Editorial Scholar</span>
            </div>

            {/* Center Content */}
            <div className="scholar-left-content position-relative d-flex flex-column justify-content-center align-items-center text-center flex-grow-1">
              <h1 className="scholar-left-title">
                Curate Your
                <br />
                Academic
                <br />
                Destiny
              </h1>

              <p className="scholar-left-text">
                Join a community of scholars focused on deep editorial rigor and
                architectural learning design.
              </p>
            </div>

          </div>

          {/* RIGHT PANEL */}
          <div className="col-lg-7 scholar-signup-right d-flex align-items-center justify-content-center">
            <div className="scholar-signup-card">

              <h2 className="signup-title">Create Account</h2>
              <p className="signup-subtitle">ENROLLMENT PHASE 01</p>

              <form onSubmit={handleSubmit}>
                
                {/* Identity */}
                <div className="section-block">
                  <div className="section-heading">👤 Identity Details</div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label>FULL NAME</label>
                      <input
                        type="text"
                        name="fullName"
                        className="form-control scholar-input"
                        placeholder="E.g. Alexander Sterling"
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label>USERNAME</label>
                      <input
                        type="text"
                        name="username"
                        className="form-control scholar-input"
                        placeholder="asterling_scholar"
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-12 mb-3">
                      <label>EMAIL ADDRESS</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control scholar-input"
                        placeholder="scholar@editorial.edu"
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-12 mb-3">
                      <label>PASSWORD</label>
                      <input
                        type="password"
                        name="password"
                        className="form-control scholar-input"
                        placeholder="••••••••"
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Professional */}
                <div className="section-block">
                  <div className="section-heading">💼 Professional Context</div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label>ROLE</label>
                      <select
                        name="role"
                        className="form-select scholar-input"
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Role</option>
                        {roles.map((role) => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label>DEPARTMENT</label>
                      <select
                        name="department"
                        className="form-select scholar-input"
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label>JOB TITLE</label>
                      <input
                        type="text"
                        name="job_title"
                        className="form-control scholar-input"
                        placeholder="Lead Manuscript Reviewer"
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label>EMPLOYEE ID</label>
                      <input
                        type="text"
                        name="employee_id"
                        className="form-control scholar-input"
                        placeholder="ES-9920-X"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <button className="btn scholar-btn w-100">
                  Finalize Enrollment
                </button>
              </form>

              <p className="text-center mt-3">
                Already a scholar? <Link to="/login">Sign In here</Link>
              </p>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}