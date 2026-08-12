import { useEffect, useState } from "react";
import PageTitle from "../components/PageTitle";
import API from "../api";
import AddCourse from "./AddCourse";
import EditCourse from "./EditCourse";
import ViewCourse from "./ViewCourse";
import "../assets/css/bootstrap.min.css";
import "../assets/css/user.css";

const Courses = () => {
  const role = localStorage.getItem("role");
  const managecourses = role === "admin" || role === "trainer";


  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await API.get("/api/courses/");
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching Courses:", err);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const query = searchTerm.trim().toLowerCase();

    return (
      course.title?.toLowerCase().includes(query) ||
      course.description?.toLowerCase().includes(query) ||
      course.course_type?.toLowerCase().includes(query)
    );
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Course?")) return;
    try {
      await API.delete(`/api/Courses/${id}/`);
      setCourses(courses.filter((u) => u.id !== id));
      setShowView(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
       <>
       <PageTitle title="Courses" />
        <div className="container-fluid px-3">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
            <h3 className="mb-2">Course Management</h3>
            {managecourses &&(
                <button
              className="btn btn-danger mb-2"
              onClick={() => setShowAdd(true)}
            >
              Add New Course
            </button>
            )}
          
          </div>

        <div className="mb-5" style={{ width: "100%", maxWidth: "420px" }}>
          <input
            type="search"
            placeholder="Search courses"
            className="form-control text-dark border rounded"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

          {/* Cards Grid */}
          <div className="row g-3">
            {filteredCourses.map((course) => (
              <div key={course.id} className="col-md-4 col-sm-6">
                <div
                  className="card h-100 shadow-sm border-0 rounded-3 course-card"
                  style={{ cursor: "pointer", transition: "transform 0.2s" }}
                  onClick={() => {
                    setSelectedCourse(course);
                    setShowView(true);
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.03)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <div className="card-body">
                    <h5 className="card-title text-dark fw-bold">{course.title}</h5>
                    <p className="card-text text-muted">
                      {course.description
                        ? course.description.length > 100
                          ? `${course.description.substring(0, 100)}...`
                          : course.description
                        : "No description available"}
                    </p>
                    <span className="badge bg-primary">{course.course_type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredCourses.length === 0 && (
            <div className="col-12 mt-5 text-center">
              <p className="text-muted">No courses match your search.</p>
            </div>
          )}
          {/* Modals */}
          {showAdd && (
            <AddCourse onClose={() => setShowAdd(false)} onSuccess={fetchCourses} />
          )}

          {showView && selectedCourse && (
            <ViewCourse
              course={selectedCourse}
              onClose={() => setShowView(false)}
              onDelete={handleDelete}
              onEdit={() => {
                setShowView(false);
                setShowEdit(true);
              }}
            />
          )}

          {showEdit && selectedCourse && (
            <EditCourse
              course={selectedCourse}
              onClose={() => setShowEdit(false)}
              onSuccess={() => {
                fetchCourses();
                setShowEdit(false);
              }}
            />
          )}
        </div>
       </>
  );
};

export default Courses;
