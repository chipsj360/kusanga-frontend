import '../assets/css/bootstrap.min.css'
import '../assets/css/file-upload.css'
import '../assets/css/plyr.css'
import '../assets/css/full-calendar.css'
import '../assets/css/jquery-ui.css'
import '../assets/css/editor-quill.css'
import '../assets/css/apexcharts.css'
import '../assets/css/calendar.css'
import '../assets/css/jquery-jvectormap-2.0.5.css'
import '../assets/css/main.css'
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from '../api';
import UserImg from "../assets/images/avatars/male-avatar.png";

const Navbar=()=>{
const navigate = useNavigate();
const [user, setUser] = useState(null);

  useEffect(() => {
    const getLoggedInUser = async () => {
      try {
        const response = await API.get("/api/auth/user/");
        setUser(response.data.user ?? response.data);
      } catch (error) {
        console.error("Unable to load logged-in user:", error.response?.data);
      }
    };

    getLoggedInUser();
  }, []);

  const userName =
    user?.full_name ||
    user?.name ||
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.username ||
    "User";

  const logout = async () => {
    try {
      const refresh = localStorage.getItem("refresh");

      if (refresh) {
        await API.post("/api/auth/logout/", { refresh });
      }
    } catch (error) {
      console.error("Logout error:", error.response?.data);
    } finally {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      navigate("/login");
    }
  };

    return(
    
     <>
  {/* Hello world */}
  <div >
    <div className="top-navbar flex-between gap-16">
      <div className="flex-align gap-16">
        {/* Toggle Button Start */}
        <button
          type="button"
          className="toggle-btn d-xl-none d-flex text-26 text-gray-500"
        >
          <i className="ph ph-list" />
        </button>
        {/* Toggle Button End */}
        <form action="#" className="w-350 d-sm-block d-none">
          <div className="position-relative">
            <button
              type="submit"
              className="input-icon text-xl d-flex text-gray-100 pointer-event-none"
            >
              {/* <i className="ph ph-magnifying-glass" /> */}
            </button>
            {/* <input
              type="text"
              className="form-control ps-40 h-40 border-transparent focus-border-main-600 bg-main-50 rounded-pill placeholder-15"
              placeholder="Search..."
            /> */}
          </div>
        </form>
      </div>
      <div className="flex-align gap-16">
                <div className="flex-align gap-8">
              
                {/* Language Start */}
                {/* <div className="dropdown">
                    <button
                    className="text-gray-500 w-40 h-40 bg-main-50 hover-bg-main-100 transition-2 rounded-circle text-xl flex-center"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    >
                    <i className="ph ph-globe" />
                    </button>
                    <div className="dropdown-menu dropdown-menu--md border-0 bg-transparent p-0">
                    <div className="card border border-gray-100 rounded-12 box-shadow-custom">
                        <div className="card-body">
                        <div className="max-h-270 overflow-y-auto scroll-sm pe-8">
                            <div className="form-check form-radio d-flex align-items-center justify-content-between ps-0 mb-16">
                            <label
                                className="ps-0 form-check-label line-height-1 fw-medium text-secondary-light"
                                htmlFor="arabic"
                            >
                                <span className="text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-8">
                                <img
                                    src="assets/images/thumbs/flag1.png"
                                    alt=""
                                    className="w-32-px h-32-px border borde border-gray-100 rounded-circle flex-shrink-0"
                                />
                                <span className="text-15 fw-semibold mb-0">
                                    Arabic
                                </span>
                                </span>
                            </label>
                            <input
                                className="form-check-input"
                                type="radio"
                                name="language"
                                id="arabic"
                            />
                            </div>
                            <div className="form-check form-radio d-flex align-items-center justify-content-between ps-0 mb-16">
                            <label
                                className="ps-0 form-check-label line-height-1 fw-medium text-secondary-light"
                                htmlFor="germany"
                            >
                                <span className="text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-8">
                                <img
                                    src="assets/images/thumbs/flag2.png"
                                    alt=""
                                    className="w-32-px h-32-px border borde border-gray-100 rounded-circle flex-shrink-0"
                                />
                                <span className="text-15 fw-semibold mb-0">
                                    Germany
                                </span>
                                </span>
                            </label>
                            <input
                                className="form-check-input"
                                type="radio"
                                name="language"
                                id="germany"
                            />
                            </div>
                            <div className="form-check form-radio d-flex align-items-center justify-content-between ps-0 mb-16">
                            <label
                                className="ps-0 form-check-label line-height-1 fw-medium text-secondary-light"
                                htmlFor="english"
                            >
                                <span className="text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-8">
                                <img
                                    src="assets/images/thumbs/flag3.png"
                                    alt=""
                                    className="w-32-px h-32-px border borde border-gray-100 rounded-circle flex-shrink-0"
                                />
                                <span className="text-15 fw-semibold mb-0">
                                    English
                                </span>
                                </span>
                            </label>
                            <input
                                className="form-check-input"
                                type="radio"
                                name="language"
                                id="english"
                            />
                            </div>
                            <div className="form-check form-radio d-flex align-items-center justify-content-between ps-0">
                            <label
                                className="ps-0 form-check-label line-height-1 fw-medium text-secondary-light"
                                htmlFor="spanish"
                            >
                                <span className="text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-8">
                                <img
                                    src="assets/images/thumbs/flag4.png"
                                    alt=""
                                    className="w-32-px h-32-px border borde border-gray-100 rounded-circle flex-shrink-0"
                                />
                                <span className="text-15 fw-semibold mb-0">
                                    Spanish
                                </span>
                                </span>
                            </label>
                            <input
                                className="form-check-input"
                                type="radio"
                                name="language"
                                id="spanish"
                            />
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div> */}
                {/* Language Start */}
                </div>
                {/* User Profile Start */}
                <div className="dropdown">
                <button
                    className="users arrow-down-icon border border-gray-200 rounded-pill p-4 d-inline-block pe-40 position-relative"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    <span className="position-relative">
                    <img
                        src={UserImg}
                        alt="Image"
                        className="h-32 w-32 rounded-circle"
                    />
                    <span className="activation-badge w-8 h-8 position-absolute inset-block-end-0 inset-inline-end-0" />
                    </span>
                </button>
                <div className="dropdown-menu dropdown-menu--lg border-0 bg-transparent p-0">
                    <div className="card border border-gray-100 rounded-12 box-shadow-custom">
                    <div className="card-body">
                        <div className="flex-align gap-8 mb-20 pb-20 border-bottom border-gray-100">
                        <img
                            src={UserImg}
                            alt=""
                            className="w-54 h-54 rounded-circle"
                        />
                        <div>
                            <h4 className="mb-0">{userName}</h4>
                            <p className="fw-medium text-13 text-gray-200">
                            {user?.email || ""}
                            </p>
                        </div>
                        </div>
                        <ul className="max-h-270 overflow-y-auto scroll-sm pe-4">
                        <li className="mb-4">
                            <a
                            href="setting.html"
                            className="py-12 text-15 px-20 hover-bg-gray-50 text-gray-300 rounded-8 flex-align gap-8 fw-medium text-15"
                            >
                            <span className="text-2xl text-primary-600 d-flex">
                                <i className="ph ph-gear" />
                            </span>
                            <span className="text">Account Settings</span>
                            </a>
                        </li>

                        {/* <li className="mb-4">
                            <a
                            href="analytics.html"
                            className="py-12 text-15 px-20 hover-bg-gray-50 text-gray-300 rounded-8 flex-align gap-8 fw-medium text-15"
                            >
                            <span className="text-2xl text-primary-600 d-flex">
                                <i className="ph ph-chart-line-up" />
                            </span>
                            <span className="text">Daily Activity</span>
                            </a>
                        </li> */}
                        {/* <li className="mb-4">
                            <a
                            href="message.html"
                            className="py-12 text-15 px-20 hover-bg-gray-50 text-gray-300 rounded-8 flex-align gap-8 fw-medium text-15"
                            >
                            <span className="text-2xl text-primary-600 d-flex">
                                <i className="ph ph-chats-teardrop" />
                            </span>
                            <span className="text">Inbox</span>
                            </a>
                        </li> */}
                        {/* <li className="mb-4">
                            <a
                            href="email.html"
                            className="py-12 text-15 px-20 hover-bg-gray-50 text-gray-300 rounded-8 flex-align gap-8 fw-medium text-15"
                            >
                            <span className="text-2xl text-primary-600 d-flex">
                                <i className="ph ph-envelope-simple" />
                            </span>
                            <span className="text">Email</span>
                            </a>
                        </li> */}
                        <li className="pt-8 border-top border-gray-100">
                        <div
                            className="py-12 px-20 text-danger-600 flex-align gap-8 cursor-pointer"
                            onClick={logout}
                        >
                            <i className="ph ph-sign-out" />
                            <span>Log Out</span>
                        </div>
                        </li>
                        </ul>
                    </div>
                    </div>
                </div>
                </div>
                {/* User Profile Start */}
            </div>
            </div>
        </div>
       

     </>
    );
}
export default Navbar;