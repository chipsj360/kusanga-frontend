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

const Navbar=()=>{

    return(
    
     <>
  {/* Hello world */}
  <div className="dashboard-main-wrapper">
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
              <i className="ph ph-magnifying-glass" />
            </button>
            <input
              type="text"
              className="form-control ps-40 h-40 border-transparent focus-border-main-600 bg-main-50 rounded-pill placeholder-15"
              placeholder="Search..."
            />
          </div>
        </form>
      </div>
      <div className="flex-align gap-16">
                <div className="flex-align gap-8">
                {/* Notification Start */}
                <div className="dropdown">
                    <button
                    className="dropdown-btn shaking-animation text-gray-500 w-40 h-40 bg-main-50 hover-bg-main-100 transition-2 rounded-circle text-xl flex-center"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    >
                    <span className="position-relative">
                        <i className="ph ph-bell" />
                        <span className="alarm-notify position-absolute end-0" />
                    </span>
                    </button>
                    <div className="dropdown-menu dropdown-menu--lg border-0 bg-transparent p-0">
                    <div className="card border border-gray-100 rounded-12 box-shadow-custom p-0 overflow-hidden">
                        <div className="card-body p-0">
                        <div className="py-8 px-24 bg-main-600">
                            <div className="flex-between">
                            <h5 className="text-xl fw-semibold text-white mb-0">
                                Notifications
                            </h5>
                            <div className="flex-align gap-12">
                                <button
                                type="button"
                                className="bg-white rounded-6 text-sm px-8 py-2 hover-text-primary-600"
                                >
                                {" "}
                                New{" "}
                                </button>
                                <button
                                type="button"
                                className="close-dropdown hover-scale-1 text-xl text-white"
                                >
                                <i className="ph ph-x" />
                                </button>
                            </div>
                            </div>
                        </div>
                        <div className="p-24 max-h-270 overflow-y-auto scroll-sm">
                            <div className="d-flex align-items-start gap-12">
                            <img
                                src="assets/images/thumbs/notification-img1.png"
                                alt=""
                                className="w-48 h-48 rounded-circle object-fit-cover"
                            />
                            <div className="border-bottom border-gray-100 mb-24 pb-24">
                                <div className="flex-align gap-4">
                                <a
                                    href="#"
                                    className="fw-medium text-15 mb-0 text-gray-300 hover-text-main-600 text-line-2"
                                >
                                    Ashwin Bose is requesting access to Design File -
                                    Final Project.{" "}
                                </a>
                                {/* Three Dot Dropdown Start */}
                                <div className="dropdown flex-shrink-0">
                                    <button
                                    className="text-gray-200 rounded-4"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    >
                                    <i className="ph-fill ph-dots-three-outline" />
                                    </button>
                                    <div className="dropdown-menu dropdown-menu--md border-0 bg-transparent p-0">
                                    <div className="card border border-gray-100 rounded-12 box-shadow-custom">
                                        <div className="card-body p-12">
                                        <div className="max-h-200 overflow-y-auto scroll-sm pe-8">
                                            <ul>
                                            <li className="mb-0">
                                                <a
                                                href="#"
                                                className="py-6 text-15 px-8 hover-bg-gray-50 text-gray-300 rounded-8 fw-normal text-xs d-block"
                                                >
                                                <span className="text">
                                                    Mark as read
                                                </span>
                                                </a>
                                            </li>
                                            <li className="mb-0">
                                                <a
                                                href="#"
                                                className="py-6 text-15 px-8 hover-bg-gray-50 text-gray-300 rounded-8 fw-normal text-xs d-block"
                                                >
                                                <span className="text">
                                                    Delete Notification
                                                </span>
                                                </a>
                                            </li>
                                            <li className="mb-0">
                                                <a
                                                href="#"
                                                className="py-6 text-15 px-8 hover-bg-gray-50 text-gray-300 rounded-8 fw-normal text-xs d-block"
                                                >
                                                <span className="text">Report</span>
                                                </a>
                                            </li>
                                            </ul>
                                        </div>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                {/* Three Dot Dropdown End */}
                                </div>
                                <div className="flex-align gap-6 mt-8">
                                <img
                                    src="assets/images/icons/google-drive.png"
                                    alt=""
                                />
                                <div className="flex-align gap-4">
                                    <p className="text-gray-900 text-sm text-line-1">
                                    Design brief and ideas.txt
                                    </p>
                                    <span className="text-xs text-gray-200 flex-shrink-0">
                                    2.2 MB
                                    </span>
                                </div>
                                </div>
                                <div className="mt-16 flex-align gap-8">
                                <button
                                    type="button"
                                    className="btn btn-main py-8 text-15 fw-normal px-16"
                                >
                                    Accept
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-gray py-8 text-15 fw-normal px-16"
                                >
                                    Decline
                                </button>
                                </div>
                                <span className="text-gray-200 text-13 mt-8">
                                2 mins ago
                                </span>
                            </div>
                            </div>
                            <div className="d-flex align-items-start gap-12">
                            <img
                                src="assets/images/thumbs/notification-img2.png"
                                alt=""
                                className="w-48 h-48 rounded-circle object-fit-cover"
                            />
                            <div className="">
                                <a
                                href="#"
                                className="fw-medium text-15 mb-0 text-gray-300 hover-text-main-600 text-line-2"
                                >
                                Patrick added a comment on Design Assets - Smart Tags
                                file:
                                </a>
                                <span className="text-gray-200 text-13">
                                2 mins ago
                                </span>
                            </div>
                            </div>
                        </div>
                        <a
                            href="#"
                            className="py-13 px-24 fw-bold text-center d-block text-primary-600 border-top border-gray-100 hover-text-decoration-underline"
                        >
                            {" "}
                            View All{" "}
                        </a>
                        </div>
                    </div>
                    </div>
                </div>
                {/* Notification Start */}
                {/* Language Start */}
                <div className="dropdown">
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
                </div>
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
                        src="assets/images/thumbs/user-img.png"
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
                            src="assets/images/thumbs/user-img.png"
                            alt=""
                            className="w-54 h-54 rounded-circle"
                        />
                        <div className="">
                            <h4 className="mb-0">Michel John</h4>
                            <p className="fw-medium text-13 text-gray-200">
                            examplemail@mail.com
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
                        <li className="mb-4">
                            <a
                            href="pricing-plan.html"
                            className="py-12 text-15 px-20 hover-bg-gray-50 text-gray-300 rounded-8 flex-align gap-8 fw-medium text-15"
                            >
                            <span className="text-2xl text-primary-600 d-flex">
                                <i className="ph ph-chart-bar" />
                            </span>
                            <span className="text">Upgrade Plan</span>
                            </a>
                        </li>
                        <li className="mb-4">
                            <a
                            href="analytics.html"
                            className="py-12 text-15 px-20 hover-bg-gray-50 text-gray-300 rounded-8 flex-align gap-8 fw-medium text-15"
                            >
                            <span className="text-2xl text-primary-600 d-flex">
                                <i className="ph ph-chart-line-up" />
                            </span>
                            <span className="text">Daily Activity</span>
                            </a>
                        </li>
                        <li className="mb-4">
                            <a
                            href="message.html"
                            className="py-12 text-15 px-20 hover-bg-gray-50 text-gray-300 rounded-8 flex-align gap-8 fw-medium text-15"
                            >
                            <span className="text-2xl text-primary-600 d-flex">
                                <i className="ph ph-chats-teardrop" />
                            </span>
                            <span className="text">Inbox</span>
                            </a>
                        </li>
                        <li className="mb-4">
                            <a
                            href="email.html"
                            className="py-12 text-15 px-20 hover-bg-gray-50 text-gray-300 rounded-8 flex-align gap-8 fw-medium text-15"
                            >
                            <span className="text-2xl text-primary-600 d-flex">
                                <i className="ph ph-envelope-simple" />
                            </span>
                            <span className="text">Email</span>
                            </a>
                        </li>
                        <li className="pt-8 border-top border-gray-100">
                            <a
                            href="sign-in.html"
                            className="py-12 text-15 px-20 hover-bg-danger-50 text-gray-300 hover-text-danger-600 rounded-8 flex-align gap-8 fw-medium text-15"
                            >
                            <span className="text-2xl text-danger-600 d-flex">
                                <i className="ph ph-sign-out" />
                            </span>
                            <span className="text">Log Out</span>
                            </a>
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