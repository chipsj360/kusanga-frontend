import '../assets/css/Signup.css'
import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
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
