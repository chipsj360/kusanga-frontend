import '../assets/css/Login.css'
import '../assets/css/bootstrap.min.css'
import { Link } from 'react-router-dom';
const Login=() =>{

    return(
   <>
    <div className="auth-page">
      <div className="auth-card text-white mx-3">
        <h3 className="text-center mb-3">Welcome Back</h3>
        <p className="text-center">Sign in to your account</p>

        <form>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email Address"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
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