import '../assets/css/Signup.css'
import { useState,useEffect } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

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
    <div className="signup-page"> {/* scoped wrapper */}
      <div className="auth-card text-white mx-3">
        <h3 className="text-center mb-3">Create Account</h3>
        <p className="text-center">Sign up to get started</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input type="text"
              name="fullName"
             className="form-control"
              placeholder="Full Name"
              onChange={handleChange}
              required />
          </div>
          <div className="mb-3">
            <input type="text"
            name="username"
            className="form-control" 
            placeholder="Username" 
            onChange={handleChange}
            required />
          </div>
          <div className="mb-3">
            <input type="email" 
            name="email"
            className="form-control"
             placeholder="Email Address"
             onChange={handleChange}
             required />
          </div>
          <div className="mb-3">
            <input type="password" 
            name='password'
            className="form-control" 
            placeholder="Password" 
            onChange={handleChange}
            required />
          </div>
          <div className="mb-3">
            <select
              name="role"
              className="form-control"
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

          <div className="mb-3">
            <select
              name="department"
              className="form-control"
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

          <div className="mb-3">
            <input
              type="text"
              name="job_title"
              className="form-control"
              placeholder="Job Title"
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              name="employee_id"
              className="form-control"
              placeholder="Employee ID"
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-custom w-100">Sign Up</button>
        </form>
        <hr className="bg-light" />
        <div className="text-center">
          <p>Already have an account? <a href="login.html">Sign in</a></p>
        </div>
      </div>
    </div>
  )
}
