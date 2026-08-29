import PageTitle from "../components/PageTitle";
import "../assets/css/login.css";
import "../assets/css/bootstrap.min.css";
import Elearning from "../assets/images/logo/Elearning.jpg";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const Login = () => {
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
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("userId", res.data.id);

      navigate("/");
    } catch (error) {
      console.error(error.response?.data);
      alert("Login failed");
    }
  };

  return (
    <>
      <PageTitle title="Login" />
      <div className="scholar-login-page">
        <div className="container-fluid h-100">
          <div className="row min-vh-100 g-0">
            {/* Left Section */}
            <div className="col-lg-7 scholar-left d-flex align-items-center">
              <div className="scholar-left-content w-100">
                <div className="row align-items-center">
                  <div className="col-12 col-xl-4 mb-4 mb-xl-0 text-center text-xl-start">
                    <div className="book-image-box mx-auto mx-xl-0">
                      <img
                        src={Elearning}
                        alt="Books"
                        className="img-fluid book-image"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                      <div className="book-placeholder"></div>
                    </div>
                  </div>

                  <div className="col-12 col-xl-8">
                    <div className="brand-row mb-3 justify-content-center justify-content-xl-start">
                      <span className="brand-icon">📖</span>
                      <span className="brand-text">Kusanga E Learning Platform</span>
                    </div>

                    <h1 className="hero-title text-center text-xl-start">
                      Skills That Move <br />
                      <span className="hero-italic">Work Forward.</span>
                    </h1>

                    <p className="hero-subtitle text-center text-xl-start">
                      Empower every team from frontline professionals to future leaderswith
                      practical courses, industry-recognized certifications, and learning
                      designed for real-world impact.
                    </p>

                    {/* <div className="stats-row justify-content-center justify-content-xl-start">
                      <div className="stat-card">
                        <h3>420+</h3>
                        <p>JOURNALS PUBLISHED</p>
                      </div>
                      <div className="stat-card">
                        <h3>12k</h3>
                        <p>SCHOLARS ACTIVE</p>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="col-lg-5 scholar-right d-flex align-items-center justify-content-center">
              <div className="scholar-login-card">
                <h2 className="login-title">Sign In</h2>
                <p className="login-subtitle">SECURE ACCESS PROTOCOL</p>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label scholar-label">EMAIL OR USERNAME</label>
                    <div className="input-icon-wrap">
                      <span className="input-icon">@</span>
                      <input
                        type="text"
                        name="username"
                        className="form-control scholar-input"
                        placeholder="scholar@university.edu"
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <label className="form-label scholar-label mb-2">PASSWORD</label>
                      <a href="#" className="forgot-link">
                        FORGOT?
                      </a>
                    </div>

                    <div className="input-icon-wrap">
                      <span className="input-icon">🔒</span>
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

                  <button type="submit" className="btn scholar-primary-btn w-100">
                    Login
                  </button>
                </form>

                {/* <div className="divider-wrap">
                  <span>NEW TO THE PLATFORM?</span>
                </div>

                <Link to="/signup" className="btn scholar-secondary-btn w-100">
                  Create Scholar Account
                </Link> */}

                <p className="terms-text">
                  By signing in, you agree to our <a href="#">Terms of Service</a> and{" "}
                  <a href="#">Privacy Policy</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;