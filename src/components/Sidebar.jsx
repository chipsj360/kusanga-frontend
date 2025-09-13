import { Link } from "react-router-dom";
const SideBar=()=>{
    return(
        <>
        <div className="side-overlay" />
        <aside className="sidebar">
            {/* sidebar close btn */}
            <button
                type="button"
                className="sidebar-close-btn text-gray-500 hover-text-white hover-bg-main-600 text-md w-24 h-24 border border-gray-100 hover-border-main-600 d-xl-none d-flex flex-center rounded-circle position-absolute"
            >
                <i className="ph ph-x" />
            </button>
            {/* sidebar close btn */}
            <a
                href="index.html"
                className="sidebar__logo text-center p-20 position-sticky inset-block-start-0 bg-white w-100 z-1 pb-10"
            >
                <img src="assets/images/logo/logo.png" alt="Logo" />
            </a>
            <div className="sidebar-menu-wrapper overflow-y-auto scroll-sm">
                <div className="p-20 pt-10">
                <ul className="sidebar-menu">
                    <li className="sidebar-menu__item has-dropdown">
                    <a href="javascript:void(0)" className="sidebar-menu__link">
                        <span className="icon">
                        <i className="ph ph-squares-four" />
                        </span>
                        <span className="text">Dashboard</span>
                        <span className="link-badge">3</span>
                    </a>
                    {/* Submenu start */}
                    <ul className="sidebar-submenu">
                        <li className="sidebar-submenu__item">
                        <a href="index.html" className="sidebar-submenu__link">
                            {" "}
                            Dashboard One{" "}
                        </a>
                        </li>
                        <li className="sidebar-submenu__item">
                        <a href="index-2.html" className="sidebar-submenu__link">
                            {" "}
                            Dashboard Two{" "}
                        </a>
                        </li>
                        <li className="sidebar-submenu__item">
                        <a href="index-3.html" className="sidebar-submenu__link">
                            {" "}
                            Dashboard Three{" "}
                        </a>
                        </li>
                    </ul>
                    {/* Submenu End */}
                    </li>
                    <li className="sidebar-menu__item has-dropdown">
                    <a href="javascript:void(0)" className="sidebar-menu__link">
                        <span className="icon">
                        <i className="ph ph-graduation-cap" />
                        </span>
                        <span className="text">Courses</span>
                    </a>
                    {/* Submenu start */}
                    <ul className="sidebar-submenu">
                        <li className="sidebar-submenu__item">
                        <Link to="/courses" className="sidebar-submenu__link">
                            {" "}
                            Student Courses{" "}
                        </Link>
                        </li>
                        <li className="sidebar-submenu__item">
                        <a href="mentor-courses.html" className="sidebar-submenu__link">
                            {" "}
                            Mentor Courses{" "}
                        </a>
                        </li>
                        <li className="sidebar-submenu__item">
                        <a href="create-course.html" className="sidebar-submenu__link">
                            {" "}
                            Create Course{" "}
                        </a>
                        </li>
                    </ul>
                    {/* Submenu End */}
                    </li>
                    <li className="sidebar-menu__item">
                    <a href="students.html" className="sidebar-menu__link">
                        <span className="icon">
                        <i className="ph ph-users-three" />
                        </span>
                        <span className="text">Students</span>
                    </a>
                    </li>
                    <li className="sidebar-menu__item">
                    <a href="assignment.html" className="sidebar-menu__link">
                        <span className="icon">
                        <i className="ph ph-clipboard-text" />
                        </span>
                        <span className="text">Assignments</span>
                    </a>
                    </li>
                    <li className="sidebar-menu__item">
                    <a href="mentors.html" className="sidebar-menu__link">
                        <span className="icon">
                        <i className="ph ph-users" />
                        </span>
                        <span className="text">Mentors</span>
                    </a>
                    </li>
                    <li className="sidebar-menu__item">
                    <a href="resources.html" className="sidebar-menu__link">
                        <span className="icon">
                        <i className="ph ph-bookmarks" />
                        </span>
                        <span className="text">Resources</span>
                    </a>
                    </li>
                    <li className="sidebar-menu__item">
                    <a href="message.html" className="sidebar-menu__link">
                        <span className="icon">
                        <i className="ph ph-chats-teardrop" />
                        </span>
                        <span className="text">Messages</span>
                    </a>
                    </li>
                    <li className="sidebar-menu__item">
                    <a href="analytics.html" className="sidebar-menu__link">
                        <span className="icon">
                        <i className="ph ph-chart-bar" />
                        </span>
                        <span className="text">Analytics</span>
                    </a>
                    </li>
                    <li className="sidebar-menu__item">
                    <a href="event.html" className="sidebar-menu__link">
                        <span className="icon">
                        <i className="ph ph-calendar-dots" />
                        </span>
                        <span className="text">Events</span>
                    </a>
                    </li>
                    <li className="sidebar-menu__item">
                    <a href="library.html" className="sidebar-menu__link">
                        <span className="icon">
                        <i className="ph ph-books" />
                        </span>
                        <span className="text">Library</span>
                    </a>
                    </li>
                    <li className="sidebar-menu__item">
                    <a href="pricing-plan.html" className="sidebar-menu__link">
                        <span className="icon">
                        <i className="ph ph-coins" />
                        </span>
                        <span className="text">Pricing</span>
                    </a>
                    </li>
                    <li className="sidebar-menu__item">
                    <span className="text-gray-300 text-sm px-20 pt-20 fw-semibold border-top border-gray-100 d-block text-uppercase">
                        Settings
                    </span>
                    </li>
                    <li className="sidebar-menu__item">
                    <a href="setting.html" className="sidebar-menu__link">
                        <span className="icon">
                        <i className="ph ph-gear" />
                        </span>
                        <span className="text">Account Settings</span>
                    </a>
                    </li>
                    <li className="sidebar-menu__item has-dropdown">
                    <a href="javascript:void(0)" className="sidebar-menu__link">
                        <span className="icon">
                        <i className="ph ph-shield-check" />
                        </span>
                        <span className="text">Authetication</span>
                    </a>
                    {/* Submenu start */}
                    <ul className="sidebar-submenu">
                        <li className="sidebar-submenu__item">
                        <a href="sign-in.html" className="sidebar-submenu__link">
                            Sign In
                        </a>
                        </li>
                        <li className="sidebar-submenu__item">
                        <a href="sign-up.html" className="sidebar-submenu__link">
                            Sign Up
                        </a>
                        </li>
                        <li className="sidebar-submenu__item">
                        <a href="forgot-password.html" className="sidebar-submenu__link">
                            Forgot Password
                        </a>
                        </li>
                        <li className="sidebar-submenu__item">
                        <a href="reset-password.html" className="sidebar-submenu__link">
                            Reset Password
                        </a>
                        </li>
                        <li className="sidebar-submenu__item">
                        <a href="verify-email.html" className="sidebar-submenu__link">
                            Verify Email
                        </a>
                        </li>
                        <li className="sidebar-submenu__item">
                        <a
                            href="two-step-verification.html"
                            className="sidebar-submenu__link"
                        >
                            Two Step Verification
                        </a>
                        </li>
                    </ul>
                    {/* Submenu End */}
                    </li>
                </ul>
                </div>
                <div className="p-20 pt-80">
                <div className="bg-main-50 p-20 pt-0 rounded-16 text-center mt-74">
                    <span className="border border-5 bg-white mx-auto border-primary-50 w-114 h-114 rounded-circle flex-center text-success-600 text-2xl translate-n74">
                    <img
                        src="assets/images/icons/certificate.png"
                        alt=""
                        className="centerised-img"
                    />
                    </span>
                    <div className="mt-n74">
                    <h5 className="mb-4 mt-22">Get Pro Certificate</h5>
                    <p className="">Explore 400+ courses with lifetime members</p>
                    <a
                        href="pricing-plan.html"
                        className="btn btn-main mt-16 rounded-pill"
                    >
                        Get Access
                    </a>
                    </div>
                </div>
                </div>
            </div>
            </aside>

        </>
    );
}
export default SideBar;