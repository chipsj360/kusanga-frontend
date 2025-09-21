import '../assets/css/Login.css'
import '../assets/css/bootstrap.min.css'
import API from "../api";
import { useNavigate,Link } from "react-router-dom";
import { useState } from "react";
const Login=() =>{
   const [credentials, setCredentials] = useState({ username: "", password: "" });
  const navigate = useNavigate();

   const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/api/auth/login/", credentials);
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      navigate("/"); // go to dashboard
    } catch (error) {
      console.error(error.response?.data);
      alert("Login failed");
    }
  };
    return(
   <>
    <div className="auth-page">
      <div className="auth-card text-white mx-3">
        <h3 className="text-center mb-3">Welcome Back</h3>
        <p className="text-center">Sign in to your account</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="username"
              className="form-control"
              placeholder="Email Address"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Password"
              onChange={handleChange}
              required
            />
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="form-check">
              <input type="checkbox" className="form-check-input" id="rememberMe" />
              <label className="form-check-label text-white" htmlFor="rememberMe">
                Remember me
              </label>
            </div>
            <a href="#">Forgot password?</a>
          </div>

          <button type="submit" className="btn btn-custom w-100">
            Sign In
          </button>
        </form>

        <hr className="bg-light" />
        <div className="text-center">
          <p>
            Don’t have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
   </>
    );
}
export default Login;