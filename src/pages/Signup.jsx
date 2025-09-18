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
  return (
    <div className="signup-page"> {/* scoped wrapper */}
      <div className="auth-card text-white mx-3">
        <h3 className="text-center mb-3">Create Account</h3>
        <p className="text-center">Sign up to get started</p>
        <form>
          <div className="mb-3">
            <input type="text" className="form-control" placeholder="Full Name" required />
          </div>
          <div className="mb-3">
            <input type="text" className="form-control" placeholder="Username" required />
          </div>
          <div className="mb-3">
            <input type="email" className="form-control" placeholder="Email Address" required />
          </div>
          <div className="mb-3">
            <input type="password" className="form-control" placeholder="Password" required />
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
